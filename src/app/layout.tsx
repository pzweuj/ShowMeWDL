import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LocaleProvider } from "@/i18n/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShowMeWDL — Visual WDL Workflow Editor",
  description: "ComfyUI-style visual WDL workflow builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
