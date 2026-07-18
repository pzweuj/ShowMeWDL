import type { Expr, IOPort, RuntimeSpec, WdlType } from "@/features/project/types";
import { exprToString, parseExpr, parseTypeString } from "@/features/project/types";
import type {
  WdlBodyElement,
  WdlCallAst,
  WdlDocument,
  WdlImport,
  WdlStructAst,
  WdlTaskAst,
  WdlWorkflowAst,
} from "./ast";

/**
 * Practical WDL subset parser for ShowMeWDL P0.
 * Supports version, import, task, workflow, call, scatter, input/output/runtime/command.
 */

class Parser {
  private src: string;
  private i = 0;

  constructor(src: string) {
    this.src = src.replace(/^\uFEFF/, "");
  }

  parseDocument(): WdlDocument {
    this.skip();
    let version = "1.2";
    if (this.matchKeyword("version")) {
      version = this.readVersion();
      this.skip();
    }

    const imports: WdlImport[] = [];
    const tasks: WdlTaskAst[] = [];
    const workflows: WdlWorkflowAst[] = [];
    const structs: WdlStructAst[] = [];

    while (!this.eof()) {
      this.skip();
      if (this.eof()) break;
      if (this.matchKeyword("import")) {
        imports.push(this.parseImport());
      } else if (this.matchKeyword("task")) {
        tasks.push(this.parseTask());
      } else if (this.matchKeyword("workflow")) {
        workflows.push(this.parseWorkflow());
      } else if (this.matchKeyword("struct")) {
        structs.push(this.parseStruct());
      } else {
        // skip unknown top-level for robustness
        this.skipLine();
      }
    }

    return { version, imports, tasks, workflows, structs };
  }

  private parseImport(): WdlImport {
    this.skip();
    const path = this.readString();
    this.skip();
    let alias: string | undefined;
    if (this.matchKeyword("as")) {
      this.skip();
      alias = this.readIdent();
    }
    return { path, alias };
  }

  private parseTask(): WdlTaskAst {
    this.skip();
    const name = this.readIdent();
    this.skip();
    this.expect("{");
    let inputs: IOPort[] = [];
    let outputs: Array<IOPort & { expression: Expr }> = [];
    let command = "";
    let runtime: RuntimeSpec = {};
    let meta: Record<string, string> | undefined;

    while (!this.eof() && !this.peekChar("}")) {
      this.skip();
      if (this.matchKeyword("input")) {
        inputs = this.parseInputBlock();
      } else if (this.matchKeyword("output")) {
        outputs = this.parseOutputBlock();
      } else if (this.matchKeyword("command")) {
        command = this.parseCommand();
      } else if (this.matchKeyword("runtime")) {
        runtime = this.parseRuntime();
      } else if (this.matchKeyword("meta") || this.matchKeyword("parameter_meta")) {
        meta = { ...(meta ?? {}), ...this.parseStringMapBlock() };
      } else if (this.peekChar("}")) {
        break;
      } else {
        // private declarations inside task
        this.skipDeclOrUnknown();
      }
    }
    this.expect("}");
    return { name, inputs, outputs, command, runtime, meta };
  }

  private parseWorkflow(): WdlWorkflowAst {
    this.skip();
    const name = this.readIdent();
    this.skip();
    this.expect("{");
    let inputs: IOPort[] = [];
    let outputs: Array<{ name: string; type: WdlType; value: Expr }> = [];
    const body: WdlBodyElement[] = [];
    let currentSection: string | undefined;

    while (!this.eof()) {
      // Skip whitespace / non-section comments; capture section markers
      // (must not use skip() here — it would swallow # Section lines)
      const sectionHit = this.skipToCodeOrSection();
      if (sectionHit) {
        currentSection = sectionHit;
        continue;
      }
      if (this.eof() || this.src[this.i] === "}") break;
      if (this.matchKeyword("input")) {
        inputs = this.parseInputBlock();
      } else if (this.matchKeyword("output")) {
        outputs = this.parseWorkflowOutputBlock();
      } else if (this.matchKeyword("call")) {
        body.push({ ...this.parseCall(), section: currentSection });
      } else if (this.matchKeyword("scatter")) {
        body.push({ ...this.parseScatter(), section: currentSection });
      } else if (this.matchKeyword("if")) {
        body.push({ ...this.parseIf(), section: currentSection });
      } else {
        const decl = this.tryParseDecl();
        if (decl) body.push({ ...decl, section: currentSection });
        else this.skipDeclOrUnknown();
      }
    }
    this.expect("}");
    return { name, inputs, body, outputs };
  }

  /**
   * Advance past whitespace and ordinary `#` comments.
   * If a `# Section…` marker is found, consume it and return its label.
   */
  private skipToCodeOrSection(): string | undefined {
    while (!this.eof()) {
      this.skipWs();
      if (!this.src.startsWith("#", this.i)) return undefined;
      const lineEnd = this.src.indexOf("\n", this.i);
      let raw = lineEnd < 0 ? this.src.slice(this.i) : this.src.slice(this.i, lineEnd);
      raw = raw.replace(/\r/g, "").trim();
      const m = /^#\s*[Ss]ection\s*(?:0*(\d+))?(?:\s*[^\w\s]\s*(.+))?$/.exec(raw);
      this.i = lineEnd < 0 ? this.src.length : lineEnd + 1;
      if (!m) continue; // ordinary comment — keep scanning
      const num = m[1];
      const title = m[2]?.trim();
      if (!num && !title) continue;
      if (num && title) return `${num.padStart(2, "0")} · ${title}`;
      if (num) return num.padStart(2, "0");
      return title!;
    }
    return undefined;
  }

  private parseCall(): WdlCallAst {
    this.skip();
    // task name may be Alias.Task or Task
    const taskName = this.readDottedIdent();
    this.skip();
    let alias: string | undefined;
    if (this.matchKeyword("as")) {
      this.skip();
      alias = this.readIdent();
      this.skip();
    }
    const inputs: Record<string, Expr> = {};
    if (this.match("{")) {
      this.skip();
      if (this.matchKeyword("input")) {
        this.skip();
        this.expect(":");
        this.skip();
        while (!this.eof() && !this.peekChar("}")) {
          this.skip();
          if (this.peekChar("}")) break;
          const key = this.readIdent();
          this.skip();
          // allow bare name meaning self-ref, or name = expr
          if (this.match("=")) {
            this.skip();
            inputs[key] = this.readExpressionUntil([",", "}"]);
          } else {
            inputs[key] = { kind: "identifier", name: key };
          }
          this.skip();
          this.match(",");
          this.skip();
        }
      }
      this.skip();
      this.expect("}");
    }
    return { kind: "call", taskName, alias, inputs };
  }

  private parseScatter(): WdlBodyElement {
    this.skip();
    this.expect("(");
    this.skip();
    const itemVar = this.readIdent();
    this.skip();
    this.expect("in");
    this.skip();
    const collection = this.readExpressionUntil([")"]);
    this.skip();
    this.expect(")");
    this.skip();
    this.expect("{");
    const body: WdlBodyElement[] = [];
    while (!this.eof() && !this.peekChar("}")) {
      this.skip();
      if (this.matchKeyword("call")) body.push(this.parseCall());
      else if (this.matchKeyword("scatter")) body.push(this.parseScatter());
      else if (this.matchKeyword("if")) body.push(this.parseIf());
      else if (this.peekChar("}")) break;
      else {
        const decl = this.tryParseDecl();
        if (decl) body.push(decl);
        else this.skipDeclOrUnknown();
      }
    }
    this.expect("}");
    return { kind: "scatter", itemVar, collection, body };
  }

  private parseIf(): WdlBodyElement {
    this.skip();
    this.expect("(");
    this.skip();
    const condition = this.readExpressionUntil([")"]);
    this.skip();
    this.expect(")");
    this.skip();
    this.expect("{");
    const body: WdlBodyElement[] = [];
    while (!this.eof() && !this.peekChar("}")) {
      this.skip();
      if (this.matchKeyword("call")) body.push(this.parseCall());
      else if (this.matchKeyword("scatter")) body.push(this.parseScatter());
      else if (this.matchKeyword("if")) body.push(this.parseIf());
      else if (this.peekChar("}")) break;
      else {
        const decl = this.tryParseDecl();
        if (decl) body.push(decl);
        else this.skipDeclOrUnknown();
      }
    }
    this.expect("}");
    return { kind: "if", condition, body };
  }

  private parseInputBlock(): IOPort[] {
    this.skip();
    this.expect("{");
    const ports: IOPort[] = [];
    while (!this.eof() && !this.peekChar("}")) {
      this.skip();
      if (this.peekChar("}")) break;
      const type = this.readType();
      this.skip();
      const name = this.readIdent();
      this.skip();
      let def: Expr | undefined;
      if (this.match("=")) {
        this.skip();
        def = this.readExpressionUntil(["\n", "}"]);
      }
      ports.push({
        name,
        type,
        optional: type.optional,
        default: def,
      });
      this.skip();
    }
    this.expect("}");
    return ports;
  }

  private parseOutputBlock(): Array<IOPort & { expression: Expr }> {
    this.skip();
    this.expect("{");
    const outs: Array<IOPort & { expression: Expr }> = [];
    while (!this.eof() && !this.peekChar("}")) {
      this.skip();
      if (this.peekChar("}")) break;
      const type = this.readType();
      this.skip();
      const name = this.readIdent();
      this.skip();
      this.expect("=");
      this.skip();
      const expression = this.readExpressionUntil(["\n", "}"]);
      outs.push({ name, type, expression });
      this.skip();
    }
    this.expect("}");
    return outs;
  }

  private parseWorkflowOutputBlock(): Array<{ name: string; type: WdlType; value: Expr }> {
    return this.parseOutputBlock().map((o) => ({
      name: o.name,
      type: o.type,
      value: o.expression,
    }));
  }

  private parseCommand(): string {
    this.skip();
    if (this.match("<<<")) {
      const end = this.src.indexOf(">>>", this.i);
      if (end < 0) throw new Error("Unterminated command <<<");
      const body = this.src.slice(this.i, end);
      this.i = end + 3;
      return body.replace(/^\r?\n/, "").replace(/\r?\n$/, "");
    }
    if (this.match("{")) {
      // legacy command { }
      let depth = 1;
      const start = this.i;
      while (!this.eof() && depth > 0) {
        const c = this.src[this.i++];
        if (c === "{") depth++;
        else if (c === "}") depth--;
      }
      return this.src.slice(start, this.i - 1).trim();
    }
    throw new Error("Expected command body");
  }

  private parseRuntime(): RuntimeSpec {
    this.skip();
    this.expect("{");
    const runtime: RuntimeSpec = {};
    while (!this.eof() && !this.peekChar("}")) {
      this.skip();
      if (this.peekChar("}")) break;
      const key = this.readIdent();
      this.skip();
      this.expect(":");
      this.skip();
      const valueExpr = this.readExpressionUntil(["\n", ",", "}"]);
      const text = exprText(valueExpr).trim();
      if ((key === "cpu" || key === "gpu") && /^-?\d+(\.\d+)?$/.test(text)) {
        runtime[key] = Number(text);
      } else {
        runtime[key] = text.replace(/^"|"$/g, "");
      }
      this.skip();
      this.match(",");
    }
    this.expect("}");
    return runtime;
  }

  private parseStringMapBlock(): Record<string, string> {
    this.skip();
    this.expect("{");
    const map: Record<string, string> = {};
    while (!this.eof() && !this.peekChar("}")) {
      this.skip();
      if (this.peekChar("}")) break;
      const key = this.readIdent();
      this.skip();
      this.expect(":");
      this.skip();
      const val = this.readExpressionUntil(["\n", ",", "}"]);
      map[key] = exprText(val).replace(/^"|"$/g, "");
      this.skip();
      this.match(",");
    }
    this.expect("}");
    return map;
  }

  private parseStruct(): WdlStructAst {
    this.skip();
    const name = this.readIdent();
    this.skip();
    this.expect("{");
    const members: IOPort[] = [];
    while (!this.eof() && !this.peekChar("}")) {
      this.skip();
      if (this.peekChar("}")) break;
      const type = this.readType();
      this.skip();
      const memberName = this.readIdent();
      this.skip();
      let optional = type.optional;
      let defaultExpr: Expr | undefined;
      if (this.match("=")) {
        this.skip();
        defaultExpr = this.readExpressionUntil(["\n", "}"]);
      }
      members.push({
        name: memberName,
        type,
        optional,
        default: defaultExpr,
      });
      this.skip();
      this.match(",");
    }
    this.expect("}");
    return { name, members };
  }

  private tryParseDecl(): WdlBodyElement | null {
    const save = this.i;
    try {
      this.skip();
      const type = this.readType();
      this.skip();
      const name = this.readIdent();
      this.skip();
      let expression: Expr | undefined;
      if (this.match("=")) {
        this.skip();
        expression = this.readExpressionUntil(["\n", "}"]);
      }
      return { kind: "decl", name, type, expression };
    } catch {
      this.i = save;
      return null;
    }
  }

  private skipDeclOrUnknown() {
    // skip until newline or closing brace at this level — simplistic
    while (!this.eof() && this.src[this.i] !== "\n" && this.src[this.i] !== "}") {
      if (this.src[this.i] === "{") {
        this.skipBalanced("{", "}");
        return;
      }
      this.i++;
    }
    if (this.src[this.i] === "\n") this.i++;
  }

  private readType(): WdlType {
    this.skip();
    let raw = "";
    if (/[A-Za-z_]/.test(this.src[this.i] ?? "")) {
      raw += this.readIdent();
      this.skipWs();
      if (this.src[this.i] === "[") {
        raw += this.readBalancedText("[", "]");
      }
      this.skipWs();
      if (this.src[this.i] === "?") {
        raw += "?";
        this.i++;
      }
      return parseTypeString(raw);
    }
    throw new Error(`Expected type at ${this.pos()}`);
  }

  private readExpressionUntil(stops: string[]): Expr {
    this.skipWs();
    let depthParen = 0;
    let depthBracket = 0;
    let depthBrace = 0;
    const start = this.i;
    while (!this.eof()) {
      const c = this.src[this.i];
      if (c === "(") depthParen++;
      else if (c === ")") {
        if (depthParen === 0 && stops.includes(")")) break;
        depthParen = Math.max(0, depthParen - 1);
      } else if (c === "[") depthBracket++;
      else if (c === "]") depthBracket = Math.max(0, depthBracket - 1);
      else if (c === "{") depthBrace++;
      else if (c === "}") {
        if (depthBrace === 0 && stops.includes("}")) break;
        depthBrace = Math.max(0, depthBrace - 1);
      } else if (c === '"' || c === "'") {
        this.readString();
        continue;
      } else if (
        depthParen === 0 &&
        depthBracket === 0 &&
        depthBrace === 0 &&
        stops.some((s) => this.src.startsWith(s, this.i))
      ) {
        break;
      }
      this.i++;
    }
    const text = this.src.slice(start, this.i).trim();
    return parseExpr(text);
  }

  private readString(): string {
    const quote = this.src[this.i];
    if (quote !== '"' && quote !== "'") throw new Error("Expected string");
    this.i++;
    let out = "";
    while (!this.eof() && this.src[this.i] !== quote) {
      if (this.src[this.i] === "\\") {
        out += this.src[this.i++];
        if (!this.eof()) out += this.src[this.i++];
      } else {
        out += this.src[this.i++];
      }
    }
    this.expect(quote);
    return out;
  }

  private readIdent(): string {
    this.skipWs();
    const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(this.src.slice(this.i));
    if (!m) throw new Error(`Expected identifier at ${this.pos()}`);
    this.i += m[0].length;
    return m[0];
  }

  private readDottedIdent(): string {
    let name = this.readIdent();
    while (this.src[this.i] === ".") {
      this.i++;
      name += "." + this.readIdent();
    }
    return name;
  }

  private readVersion(): string {
    this.skipWs();
    const m = /^[0-9]+(\.[0-9]+)*/.exec(this.src.slice(this.i));
    if (!m) throw new Error("Expected version number");
    this.i += m[0].length;
    return m[0];
  }

  private readBalancedText(open: string, close: string): string {
    if (this.src[this.i] !== open) throw new Error(`Expected ${open}`);
    let depth = 0;
    const start = this.i;
    while (!this.eof()) {
      const c = this.src[this.i++];
      if (c === open) depth++;
      else if (c === close) {
        depth--;
        if (depth === 0) return this.src.slice(start, this.i);
      }
    }
    throw new Error(`Unbalanced ${open}${close}`);
  }

  private skipBalanced(open: string, close: string) {
    this.readBalancedText(open, close);
  }

  private matchKeyword(kw: string): boolean {
    this.skip();
    const slice = this.src.slice(this.i, this.i + kw.length);
    if (slice !== kw) return false;
    const next = this.src[this.i + kw.length];
    if (next && /[A-Za-z0-9_]/.test(next)) return false;
    this.i += kw.length;
    return true;
  }

  private match(text: string): boolean {
    this.skipWs();
    if (this.src.startsWith(text, this.i)) {
      this.i += text.length;
      return true;
    }
    return false;
  }

  private expect(text: string) {
    if (!this.match(text)) throw new Error(`Expected '${text}' at ${this.pos()}`);
  }

  private peekChar(c: string) {
    this.skip();
    return this.src[this.i] === c;
  }

  private skip() {
    while (!this.eof()) {
      this.skipWs();
      if (this.src.startsWith("#", this.i)) {
        this.skipLine();
        continue;
      }
      break;
    }
  }

  private skipWs() {
    while (!this.eof() && /[ \t\r\n]/.test(this.src[this.i]!)) this.i++;
  }

  private skipLine() {
    while (!this.eof() && this.src[this.i] !== "\n") this.i++;
    if (this.src[this.i] === "\n") this.i++;
  }

  private eof() {
    return this.i >= this.src.length;
  }

  private pos() {
    const lines = this.src.slice(0, this.i).split(/\n/);
    return `line ${lines.length}`;
  }
}

function exprText(e: Expr): string {
  if (e.kind === "literal") {
    if (typeof e.value === "string") return JSON.stringify(e.value);
    return String(e.value);
  }
  return exprToString(e);
}

export function parseWdl(source: string): WdlDocument {
  return new Parser(source).parseDocument();
}
