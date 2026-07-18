import type { ShowMeProject } from "@/features/project/types";

/** Demo from schema-germline/single.wdl — layout by # SectionNN pipeline stages */
export const singleWesDemo: ShowMeProject = {
  "version": 1,
  "name": "Demo",
  "wdlVersion": "1.2",
  "dockerGroups": [
    {
      "id": "grp_automap_1",
      "docker": "docker.schema-bio.com/schemabio/automap:1.3",
      "label": "automap",
      "taskIds": [
        "task_AutoMap"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/automap:1.3",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_mapping_2",
      "docker": "docker.schema-bio.com/schemabio/mapping:v1.0.0",
      "label": "mapping",
      "taskIds": [
        "task_BwaAlign",
        "task_Fastp",
        "task_SambambaMarkdup",
        "task_SamtoolsSexCheck",
        "task_Xamdst"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/mapping:v1.0.0",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_cnvanno_3",
      "docker": "docker.schema-bio.com/schemabio/cnvanno:v0.0.2",
      "label": "cnvanno",
      "taskIds": [
        "task_CNVAnno"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/cnvanno:v0.0.2",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_cnvkit_4",
      "docker": "docker.schema-bio.com/schemabio/cnvkit:0.9.13.2",
      "label": "cnvkit",
      "taskIds": [
        "task_CNVKitFix",
        "task_CNVKitAntitarget",
        "task_CNVKitCoverage"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/cnvkit:0.9.13.2",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_deepvariant_5",
      "docker": "docker.schema-bio.com/schemabio/deepvariant:1.10.0",
      "label": "deepvariant",
      "taskIds": [
        "task_DeepVariant"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/deepvariant:1.10.0",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_expansionhunter_6",
      "docker": "docker.schema-bio.com/schemabio/expansionhunter:5.0.0",
      "label": "expansionhunter",
      "taskIds": [
        "task_ExpansionHunter"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/expansionhunter:5.0.0",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_gatk_7",
      "docker": "docker.schema-bio.com/schemabio/gatk:4.6.2.0",
      "label": "gatk",
      "taskIds": [
        "task_MitochondrialMutect2",
        "task_LeftAlignAndTrimVariants",
        "task_CollectQCMetrics"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/gatk:4.6.2.0",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_local_8",
      "label": "local",
      "taskIds": [
        "task_FixBed",
        "task_CreateMitoBed",
        "task_TargetBed",
        "task_FingerPrint",
        "task_QCReport",
        "task_MEIReport",
        "task_STRReport",
        "task_ROHReport",
        "task_SNPInDelReport",
        "task_MTReport",
        "task_CNVGene",
        "task_CNVRegion",
        "task_SplitVcf",
        "task_UniversalMergeVcfs"
      ],
      "defaults": {
        "cpu": 4,
        "memory": "8G"
      }
    },
    {
      "id": "grp_stranger_9",
      "docker": "docker.schema-bio.com/schemabio/stranger:v0.10.0.1",
      "label": "stranger",
      "taskIds": [
        "task_Stranger"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/stranger:v0.10.0.1",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_tiea_wes_10",
      "docker": "docker.schema-bio.com/schemabio/tiea_wes:2.0.1",
      "label": "tiea_wes",
      "taskIds": [
        "task_TIEA_WES"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/tiea_wes:2.0.1",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_vep_11",
      "docker": "docker.schema-bio.com/schemabio/vep:115.2",
      "label": "vep",
      "taskIds": [
        "task_VEP"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/vep:115.2",
        "cpu": 8,
        "memory": "16G"
      }
    },
    {
      "id": "grp_whatshap_12",
      "docker": "docker.schema-bio.com/schemabio/whatshap:2.8",
      "label": "whatshap",
      "taskIds": [
        "task_Whatshap"
      ],
      "defaults": {
        "docker": "docker.schema-bio.com/schemabio/whatshap:2.8",
        "cpu": 8,
        "memory": "16G"
      }
    }
  ],
  "tasks": [
    {
      "id": "task_AutoMap",
      "name": "AutoMap",
      "groupId": "grp_automap_1",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "combined_tsv",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        if [ \"~{assembly}\" == \"GRCh38\" ]; then\n            fix_assembly=\"hg38\"\n        elif [ \"~{assembly}\" == \"GRCh37\" ]; then\n            fix_assembly=\"hg19\"\n        else\n            echo \"Unsupported assembly: ~{assembly}\" >&2\n            exit 1\n        fi\n        \n        echo -e \"#Chr\\tBegin\\tEnd\\tSize(Mb)\\tNb_variants\\tPercentage_homozygosity\\n\" > ~{prefix}.ROH.txt\n\n        bash /opt/AutoMap/AutoMap_v1.3.sh \\\n            --vcf ~{vcf} \\\n            --genome ${fix_assembly} \\\n            --out result \\\n            --id ~{prefix}\n        \n        if [ -f result/~{prefix}.HomRegions.tsv ]; then\n            cat result/~{prefix}.HomRegions.tsv | grep -v '##' > ~{prefix}.ROH.txt\n        fi\n    ",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/automap:1.3",
        "cpu": "threads",
        "memory": "~{memory_gb}G"
      }
    },
    {
      "id": "task_BwaAlign",
      "name": "BwaAlign",
      "groupId": "grp_mapping_2",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "read_1",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "read_2",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_fasta_name",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "out_bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "out_bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        set -e\n        \n        # 默认使用标准 bwa\n        USE_BWA_MEM2=false\n        if [ ~{actual_threads} -ge 16 ]; then\n            echo \"[INFO] Threads >= 16, probing for bwa-mem2 acceleration...\"\n            if grep -q -E \"avx2|avx512\" /proc/cpuinfo; then\n                echo \"[INFO] CPU supports AVX2/AVX512.\"\n                MEM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')\n                if [ \"$MEM_KB\" -gt 16777216 ]; then\n                    echo \"[INFO] Memory is sufficient ($MEM_KB KB).\"\n                    if [ -f \"~{ref_dir}/~{ref_fasta_name}.bwt.2bit.64\" ]; then\n                        echo \"[INFO] bwa-mem2 index found!\"\n                        USE_BWA_MEM2=true\n                    else\n                        echo \"[WARN] bwa-mem2 index missing. Falling back to standard bwa.\"\n                    fi\n                else\n                    echo \"[WARN] Insufficient memory for bwa-mem2. Falling back.\"\n                fi\n            else\n                echo \"[WARN] CPU lacks AVX2/AVX512. Falling back.\"\n            fi\n        else\n            echo \"[INFO] Threads < 16. Using standard bwa.\"\n        fi\n\n        # 注意：无论是谁跑，最终吐出的 BAM 名字必须一样，保证下游无缝衔接\n        \n        if [ \"$USE_BWA_MEM2\" = true ]; then\n            echo \"[RUNNING] *** bwa-mem2 mem ***\"\n            bwa-mem2 mem \\\n                -t ~{actual_threads} \\\n                -M -R \"@RG\\tID:~{prefix}\\tSM:~{prefix}\\tPL:SchemaBio\\tPU:Germline\" \\\n                ~{ref_dir}/~{ref_fasta_name} \\\n                ~{read_1} ~{read_2} | \\\n            samtools sort -@ 4 -m 2G -o ~{prefix}.sorted.bam -\n        else\n            echo \"[RUNNING] *** bwa mem ***\"\n            bwa mem \\\n                -t ~{actual_threads} \\\n                -M -R \"@RG\\tID:~{prefix}\\tSM:~{prefix}\\tPL:SchemaBio\\tPU:Germline\" \\\n                ~{ref_dir}/~{ref_fasta_name} \\\n                ~{read_1} ~{read_2} | \\\n            samtools sort -@ 4 -m 2G -o ~{prefix}.sorted.bam -\n        fi\n        \n        # 统一建索引\n        samtools index ~{prefix}.sorted.bam\n    ",
      "runtime": {
        "cpu": "actual_threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/mapping:v1.0.0"
      }
    },
    {
      "id": "task_CNVAnno",
      "name": "CNVAnno",
      "groupId": "grp_cnvanno_3",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "cnv_bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "cnv_anno_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        \n        python /app/CNVAnno/cnvanno.py \\\n            ~{cnv_bed} \\\n            -d /app/CNVAnno/data \\\n            -g ~{assembly} \\\n            -f tsv \\\n            -o ~{prefix}.cnvanno.txt\n    ",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/cnvanno:v0.0.2"
      }
    },
    {
      "id": "task_CNVKitFix",
      "name": "CNVKitFix",
      "groupId": "grp_cnvkit_4",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "target_coverage",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "antitarget_coverage",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "reference",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "cnvkit_cnr",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        cnvkit.py fix ~{target_coverage} ~{antitarget_coverage} ~{reference} -o ~{prefix}.cnvkit.cnr\n    ",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/cnvkit:0.9.13.2"
      }
    },
    {
      "id": "task_CNVKitAntitarget",
      "name": "CNVKitAntitarget",
      "groupId": "grp_cnvkit_4",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "target_bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "antitarget_bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        if [ \"~{assembly}\" == \"GRCh38\" ]; then\n            excludeble_bed=\"/app/cnvkit/data/hg38_excludeble.bed\"\n        elif [ \"~{assembly}\" == \"GRCh37\" ]; then\n            excludeble_bed=\"/app/cnvkit/data/hg19_excludeble.bed\"\n        else\n            echo \"Unsupported assembly: ~{assembly}\" >&2\n            exit 1\n        fi\n\n        cnvkit.py access ~{ref_dir}/~{fasta} -x ${excludeble_bed} -o access.bed\n        cnvkit.py antitarget ~{target_bed} -g access.bed -o ~{prefix}.antitarget.bed\n    ",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/cnvkit:0.9.13.2"
      }
    },
    {
      "id": "task_CNVKitCoverage",
      "name": "CNVKitCoverage",
      "groupId": "grp_cnvkit_4",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "target_bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "antitarget_bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "target_coverage",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "antitarget_coverage",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        cnvkit.py coverage ~{bam} ~{target_bed} -o ~{prefix}.targetcoverage.cnn -p ~{threads}\n        cnvkit.py coverage ~{bam} ~{antitarget_bed} -o ~{prefix}.antitargetcoverage.cnn -p ~{threads}\n    ",
      "runtime": {
        "cpu": "threads",
        "docker": "docker.schema-bio.com/schemabio/cnvkit:0.9.13.2"
      }
    },
    {
      "id": "task_DeepVariant",
      "name": "DeepVariant",
      "groupId": "grp_deepvariant_5",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "flank_size",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 50,
            "typeHint": "Int"
          }
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "vcf_tbi",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "gvcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "gvcf_tbi",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        awk 'BEGIN {OFS=\"\\t\"} {start=$2; end=$3; new_start=start-~{flank_size}; new_end=end+~{flank_size}; if(new_start<0) new_start=0; print $1,new_start,new_end}' ~{bed} > extended.bed\n\n        /opt/deepvariant/bin/run_deepvariant \\\n            --model_type WES \\\n            --ref ~{ref_dir}/~{fasta} \\\n            --reads ~{bam} \\\n            --output_vcf ~{prefix}.vcf.gz \\\n            --output_gvcf ~{prefix}.g.vcf.gz \\\n            --num_shards ~{threads} \\\n            --regions extended.bed\n    ",
      "runtime": {
        "cpu": "threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/deepvariant:1.10.0"
      }
    },
    {
      "id": "task_ExpansionHunter",
      "name": "ExpansionHunter",
      "groupId": "grp_expansionhunter_6",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sry_file",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sex_cutoff",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "str_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "str_json",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        sex=\"female\"\n        number=$(cat ~{sry_file})\n        if [ $number -gt ~{sex_cutoff} ]; then\n            sex=\"male\"\n        else\n            sex=\"female\"\n        fi\n\n        if [ \"~{assembly}\" == \"GRCh38\" ]; then\n            fix_assembly=\"grch38\"\n        elif [ \"~{assembly}\" == \"GRCh37\" ]; then\n            fix_assembly=\"grch37\"\n        else\n            echo \"Unsupported assembly: ~{assembly}\" >&2\n            exit 1\n        fi\n\n        ExpansionHunter \\\n            --reads ~{bam} \\\n            --reference ~{ref_dir}/~{fasta} \\\n            --variant-catalog /app/ExpansionHunter-v5.0.0-linux_x86_64/variant_catalog/${fix_assembly}/variant_catalog.json \\\n            --output-prefix ~{prefix} \\\n            -n ~{threads} \\\n            --sex ${sex}\n    ",
      "runtime": {
        "cpu": "threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/expansionhunter:5.0.0"
      }
    },
    {
      "id": "task_Fastp",
      "name": "Fastp",
      "groupId": "grp_mapping_2",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "read_1",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "read_2",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "clean_read_1",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "clean_read_2",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "json_report",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "html_report",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        fastp \\\n            -i ~{read_1} \\\n            -I ~{read_2} \\\n            -o ~{prefix}_R1.clean.fq.gz \\\n            -O ~{prefix}_R2.clean.fq.gz \\\n            -w ~{actual_threads} \\\n            -j ~{prefix}.fastp_stats.json \\\n            -h ~{prefix}.fastp_stats.html \\\n            --detect_adapter_for_pe\n    ",
      "runtime": {
        "cpu": "actual_threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/mapping:v1.0.0"
      }
    },
    {
      "id": "task_MitochondrialMutect2",
      "name": "MitochondrialMutect2",
      "groupId": "grp_gatk_7",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "vcf_tbi",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "pass_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "pass_vcf_tbi",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        gatk Mutect2 \\\n            -R ~{ref_dir}/~{fasta} \\\n            -L MT \\\n            --mitochondria-mode \\\n            -I ~{bam} \\\n            -O ~{prefix}.mt.vcf.gz\n\n        gatk FilterMutectCalls \\\n            -V ~{prefix}.mt.vcf.gz \\\n            -R ~{ref_dir}/~{fasta} \\\n            -O ~{prefix}.mt.filtered.vcf.gz\n        \n        gatk SelectVariants \\\n            -V ~{prefix}.mt.filtered.vcf.gz \\\n            --exclude-filtered true \\\n            -O ~{prefix}.mt.pass.vcf.gz\n    ",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/gatk:4.6.2.0"
      }
    },
    {
      "id": "task_LeftAlignAndTrimVariants",
      "name": "LeftAlignAndTrimVariants",
      "groupId": "grp_gatk_7",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vcf_tbi",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "left_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        gatk LeftAlignAndTrimVariants \\\n            -R ~{ref_dir}/~{fasta} \\\n            -V ~{vcf} \\\n            -O ~{prefix}.left.vcf.gz \\\n            --split-multi-allelics\n    ",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/gatk:4.6.2.0"
      }
    },
    {
      "id": "task_CollectQCMetrics",
      "name": "CollectQCMetrics",
      "groupId": "grp_gatk_7",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "summary",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "hs_metric",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        # gatk CollectInsertSizeMetrics \\\n        #     -I ~{bam} \\\n        #     -O ~{prefix}.insertsize.txt \\\n        #     -H ~{prefix}.histogram.pdf\n        \n        # gatk EstimateLibraryComplexity \\\n        #     -I ~{bam} \\\n        #     -O ~{prefix}.complexity_metrics.txt\n\n        gatk CollectAlignmentSummaryMetrics \\\n            -I ~{bam} \\\n            -R ~{ref_dir}/~{fasta} \\\n            -O ~{prefix}.metrics.txt\n\n        gatk BedToIntervalList \\\n            -I ~{bed} \\\n            -O ~{prefix}.interval_list \\\n            -SD ~{ref_dir}/~{fasta}\n\n        gatk CollectHsMetrics \\\n            -BI ~{prefix}.interval_list \\\n            -TI ~{prefix}.interval_list \\\n            -I ~{bam} \\\n            -O ~{prefix}.hs.txt\n    ",
      "runtime": {
        "cpu": "threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/gatk:4.6.2.0"
      }
    },
    {
      "id": "task_FixBed",
      "name": "FixBed",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "fixed_bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        python3 /opt/schema-germline/scripts/process_bed.py -i ~{bed} -o fixed.bed\n    ",
      "runtime": {}
    },
    {
      "id": "task_CreateMitoBed",
      "name": "CreateMitoBed",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "mito_bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        echo -e \"MT\\t1\\t16569\" > ~{prefix}.mito.bed\n    ",
      "runtime": {}
    },
    {
      "id": "task_TargetBed",
      "name": "TargetBed",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "target_bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        if [ \"~{assembly}\" == \"GRCh38\" ]; then\n            excludeble_bed=\"/opt/schema-germline/assets/Gencode.GRCh38.cnvkit.target.bed\"\n        elif [ \"~{assembly}\" == \"GRCh37\" ]; then\n            excludeble_bed=\"/opt/schema-germline/assets/Gencode.GRCh37.cnvkit.target.bed\"\n        else\n            echo \"Unsupported assembly: ~{assembly}\" >&2\n            exit 1\n        fi\n\n        bedtools intersect -b ~{bed} -a ${excludeble_bed} -wa -u > ~{prefix}.target.bed\n    ",
      "runtime": {}
    },
    {
      "id": "task_FingerPrint",
      "name": "FingerPrint",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "fingerprint_json",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        if [ \"~{assembly}\" == \"GRCh38\" ]; then\n            fix_assembly=\"grch38\"\n        elif [ \"~{assembly}\" == \"GRCh37\" ]; then\n            fix_assembly=\"grch37\"\n        else\n            echo \"Unsupported assembly: ~{assembly}\" >&2\n            exit 1\n        fi\n\n        python3 /opt/schema-germline/scripts/sample_fingerprint.py -b ~{bam} -f ~{ref_dir}/~{fasta} \\\n            -s /opt/schema-germline/assets/pengelly_snp.txt -a ${fix_assembly} -t ~{threads} \\\n            --format json -o ~{prefix}.fingerprint.json\n    ",
      "runtime": {
        "cpu": "threads"
      }
    },
    {
      "id": "task_QCReport",
      "name": "QCReport",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fastp_stats",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "xamdst_json",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "mt_xamdst_json",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fingerprint_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "gatk_metric",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "hs_metric",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sry_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sambamba_stats",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sry_cutoff",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "qc_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        python3 /opt/schema-germline/scripts/generate_qc_report.py \\\n            --sample ~{prefix} \\\n            --output ~{prefix}.qc.json \\\n            --fastp ~{fastp_stats} \\\n            --xamdst ~{xamdst_json} \\\n            --mt-xamdst ~{mt_xamdst_json} \\\n            --fingerprint ~{fingerprint_result} \\\n            --metrics ~{gatk_metric} \\\n            --hs ~{hs_metric} \\\n            --sry ~{sry_result} \\\n            --sry-cutoff ~{sry_cutoff} \\\n            --sambamba-stats ~{sambamba_stats}\n    ",
      "runtime": {}
    },
    {
      "id": "task_MEIReport",
      "name": "MEIReport",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "mei_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "mei_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        python3 /opt/schema-germline/scripts/mei_report.py \\\n            -i ~{mei_vcf} \\\n            -o ~{prefix}.mei.txt \\\n            -t /opt/schema-germline/assets/transcripts.json\n    ",
      "runtime": {}
    },
    {
      "id": "task_STRReport",
      "name": "STRReport",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "str_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "str_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        python3 /opt/schema-germline/scripts/str_report.py \\\n            -i ~{str_vcf} \\\n            -o ~{prefix}.str.txt\n    ",
      "runtime": {}
    },
    {
      "id": "task_ROHReport",
      "name": "ROHReport",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "automap_report",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "roh_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        if [ \"~{assembly}\" == \"GRCh38\" ]; then\n            bed=/opt/schema-germline/assets/Gencode.GRCh38.cnvkit.target.bed\n        elif [ \"~{assembly}\" == \"GRCh37\" ]; then\n            bed=/opt/schema-germline/assets/Gencode.GRCh37.cnvkit.target.bed\n        else\n            echo \"Unsupported assembly: ~{assembly}\" >&2\n            exit 1\n        fi\n\n        python3 /opt/schema-germline/scripts/roh_report.py \\\n            -i ~{automap_report} \\\n            -o ~{prefix}.roh.anno.txt \\\n            -g /opt/schema-germline/assets/gencc-submissions.xlsx \\\n            -b ${bed}\n    ",
      "runtime": {}
    },
    {
      "id": "task_SNPInDelReport",
      "name": "SNPInDelReport",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vep_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sry_file",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sex_cutoff",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sample_names",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": true
          },
          "optional": true
        }
      ],
      "outputs": [
        {
          "name": "snp_indel_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        # Determine sex based on SRY reads count\n        sex=\"female\"\n        number=$(cat ~{sry_file})\n        if [ $number -gt ~{sex_cutoff} ]; then\n            sex=\"male\"\n        else\n            sex=\"female\"\n        fi\n\n        # Set sample names (default to prefix if not provided)\n        if [ -z \"~{sample_names}\" ]; then\n            sample_names_arg=\"-n ~{prefix}\"\n        else\n            sample_names_arg=\"-n ~{sample_names}\"\n        fi\n\n        python3 /opt/schema-germline/scripts/vep_report.py \\\n            -i ~{vep_vcf} \\\n            -o ~{prefix}.snv_indel.txt \\\n            --gencc /opt/schema-germline/assets/gencc-submissions.xlsx \\\n            -t /opt/schema-germline/assets/transcripts.json \\\n            --sex ${sex} \\\n            ${sample_names_arg}\n    ",
      "runtime": {}
    },
    {
      "id": "task_MTReport",
      "name": "MTReport",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "mt_vep_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "mt_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        python3 /opt/schema-germline/scripts/mt_report.py \\\n            -i ~{mt_vep_vcf} \\\n            -o ~{prefix}.mt_report.txt \\\n            -m /opt/schema-germline/assets/mitophen.json\n    ",
      "runtime": {}
    },
    {
      "id": "task_CNVGene",
      "name": "CNVGene",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "cnv_cnr",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "cnv_del_threshold",
          "type": {
            "kind": "primitive",
            "name": "Float",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 1.5,
            "typeHint": "Float"
          }
        },
        {
          "name": "cnv_dup_threshold",
          "type": {
            "kind": "primitive",
            "name": "Float",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 2.5,
            "typeHint": "Float"
          }
        }
      ],
      "outputs": [
        {
          "name": "cnv_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        python3 /opt/schema-germline/scripts/gene_level_segment.py \\\n            -i ~{cnv_cnr} \\\n            -o ~{prefix}.cnv.gene.txt \\\n            --cn-del-threshold ~{cnv_del_threshold} \\\n            --cn-dup-threshold ~{cnv_dup_threshold}\n    ",
      "runtime": {}
    },
    {
      "id": "task_CNVRegion",
      "name": "CNVRegion",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "cnv_cnr",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bin_size",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "cnv_del_threshold",
          "type": {
            "kind": "primitive",
            "name": "Float",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 1.5,
            "typeHint": "Float"
          }
        },
        {
          "name": "cnv_dup_threshold",
          "type": {
            "kind": "primitive",
            "name": "Float",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 2.5,
            "typeHint": "Float"
          }
        }
      ],
      "outputs": [
        {
          "name": "cnv_result",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        python3 /opt/schema-germline/scripts/merge_bins_for_cnv.py \\\n            -i ~{cnv_cnr} \\\n            -o ~{prefix}.cnv.region.txt \\\n            --del-threshold ~{cnv_del_threshold} \\\n            --dup-threshold ~{cnv_dup_threshold} \\\n            --bin-size ~{bin_size} \\\n            --keep-antitarget\n    ",
      "runtime": {}
    },
    {
      "id": "task_SplitVcf",
      "name": "SplitVcf",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "split_vcfs",
          "type": {
            "kind": "array",
            "item": {
              "kind": "primitive",
              "name": "File",
              "optional": false
            },
            "optional": false
          }
        },
        {
          "name": "split_vcf_tbis",
          "type": {
            "kind": "array",
            "item": {
              "kind": "primitive",
              "name": "File",
              "optional": false
            },
            "optional": false
          }
        }
      ],
      "command": "        set -ex\n        # 确保输入 VCF 有索引（如果输入没给，就现场建一个）\n        if [ ! -f \"~{vcf}.tbi\" ]; then\n            bcftools index -t ~{vcf}\n        fi\n\n        for chrom in $(bcftools view -h ~{vcf} | grep \"^##contig\" | sed 's/.*ID=\\([^,>]*\\).*/\\1/' | grep -E \"^(chr)?([0-9]+|X|Y|M)$\"); do\n            bcftools view ~{vcf} --regions $chrom -O z -o ${chrom}.split.vcf.gz\n            bcftools index -t ${chrom}.split.vcf.gz\n        done\n    ",
      "runtime": {}
    },
    {
      "id": "task_UniversalMergeVcfs",
      "name": "UniversalMergeVcfs",
      "groupId": "grp_local_8",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vcfs",
          "type": {
            "kind": "array",
            "item": {
              "kind": "primitive",
              "name": "File",
              "optional": false
            },
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "merged_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "merged_vcf_tbi",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        set -ex\n\n        # 1. 汇聚文件并建立软链接\n        # 将分散在不同目录的 VCF 和 TBI 链接到当前目录，确保 bcftools 能找到配对索引\n        VCF_ARRAY=(~{sep=' ' vcfs})\n\n        for f in \"${VCF_ARRAY[@]}\"; do\n            fname=$(basename \"$f\")\n            # 检查是否为压缩格式 (.vcf.gz 或 .vcf.bgz)\n            if [[ \"$fname\" == *.vcf.gz ]] || [[ \"$fname\" == *.vcf.bgz ]]; then\n                ln -sf \"$f\" \"$fname\"\n            else\n                # 未压缩的 VCF，用 bcftools 压缩\n                ln -sf \"$f\" \"$fname\"\n                compressed_name=\"${fname}.gz\"\n                bcftools view -O z -o \"$compressed_name\" \"$fname\"\n                fname=\"$compressed_name\"\n            fi\n            bcftools index -t \"$fname\"\n            echo \"$fname\" >> processed_vcfs.txt\n        done\n\n        # 2. 生成基于基因组坐标的有序列表\n        while read -r f; do\n            INFO=$(bcftools view -H \"$f\" | head -n 1 | awk '{print $1\"\\t\"$2}')\n            if [ -n \"$INFO\" ]; then\n                printf \"%s\\t%s\\n\" \"$f\" \"$INFO\" >> unsorted_list.tmp\n            fi\n        done < processed_vcfs.txt\n\n        # 排序逻辑：\n        sort -k2,2V -k3,3n unsorted_list.tmp | cut -f1 > final_vcf_list.txt\n\n        # 3. 使用文件列表执行合并\n        bcftools concat -f final_vcf_list.txt -a -O z -o ~{prefix}.merged.vcf.gz\n\n        # 4. 建立最终索引\n        bcftools index -t ~{prefix}.merged.vcf.gz\n    ",
      "runtime": {
        "cpu": "threads",
        "memory": "~{memory_gb}G"
      }
    },
    {
      "id": "task_SambambaMarkdup",
      "name": "SambambaMarkdup",
      "groupId": "grp_mapping_2",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "markdup_bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "markdup_bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "sambamba_stats",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "flagstat_log",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        set -e\n\n        # 确保临时目录存在，防止运行时报错\n        mkdir -p ./tmp\n\n        sambamba markdup \\\n            --nthreads ~{threads} \\\n            --overflow-list-size 1000000 \\\n            --hash-table-size 1000000 \\\n            --compression-level 1 \\\n            ~{bam} \\\n            ~{prefix}.markdup.bam \\\n            --tmpdir=./tmp \\\n            2> ~{prefix}.sambamba.log\n\n        samtools index ~{prefix}.markdup.bam\n        \n        # 使用 flagstat 获取标准化的统计数据，比解析工具 log 更安全\n        samtools flagstat ~{prefix}.markdup.bam > ~{prefix}.flagstat\n\n        STATS_FILE=\"~{prefix}.sambamba.stats\"\n\n        # 安全地提取数据：使用 || true 防止 set -e 导致流程崩溃\n        TOTAL_READS=$(grep \"in total\" ~{prefix}.flagstat | awk '{print $1}' || true)\n        DUPLICATES=$(grep \"duplicates\" ~{prefix}.flagstat | awk '{print $1}' || true)\n\n        # 兜底机制：如果为空则赋值为 0，防止 Awk 报错\n        TOTAL_READS=${TOTAL_READS:-0}\n        DUPLICATES=${DUPLICATES:-0}\n\n        # 使用 Awk 计算文库复杂度 (Lander-Waterman equation)\n        awk -v N=\"$TOTAL_READS\" -v D=\"$DUPLICATES\" '\n        BEGIN {\n            U = N - D;\n\n            # 边界情况处理\n            if (N == 0 || U == 0) {\n                C = 0;\n            } else if (U >= N) {\n                C = N;\n            } else {\n                # 二分查找逼近求值\n                lower = U;\n                upper = N * 1000.0;\n\n                for (i = 0; i < 100; i++) {\n                    C = (lower + upper) / 2.0;\n                    U_est = C * (1.0 - exp(-N / C));\n\n                    diff = U_est - U;\n                    if (diff < 0) diff = -diff;\n\n                    if (diff < 0.1) {\n                        break;\n                    } else if (U_est < U) {\n                        lower = C;\n                    } else {\n                        upper = C;\n                    }\n                }\n            }\n\n            # 打印与 GATK Picard 兼容的报告\n            printf \"Total Reads:          %d\\n\", N\n            printf \"Duplicate Reads:      %d\\n\", D\n            printf \"Unique Reads:         %d\\n\", U\n            printf \"PERCENT_DUPLICATION:  %.4f\\n\", (N > 0 ? (D / N) : 0)\n            printf \"--------------------------------------\\n\"\n            printf \"ESTIMATED_LIBRARY_SIZE: %d\\n\", C\n        }' > \"$STATS_FILE\"\n\n        cat \"$STATS_FILE\"\n    ",
      "runtime": {
        "cpu": "threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/mapping:v1.0.0"
      }
    },
    {
      "id": "task_SamtoolsSexCheck",
      "name": "SamtoolsSexCheck",
      "groupId": "grp_mapping_2",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "SRY_count",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        if [ \"~{assembly}\" == \"GRCh38\" ]; then\n            samtools view ~{bam} Y:2786855-2787682 | wc -l > ~{prefix}.SRY.count.txt\n        elif [ \"~{assembly}\" == \"GRCh37\" ]; then\n            samtools view ~{bam} Y:2654896-2655723 | wc -l > ~{prefix}.SRY.count.txt\n        else\n            echo \"Unsupported assembly: ~{assembly}\" >&2\n            exit 1\n        fi\n    ",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/mapping:v1.0.0"
      }
    },
    {
      "id": "task_Stranger",
      "name": "Stranger",
      "groupId": "grp_stranger_9",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "anno_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "stranger ~{vcf} -f /app/stranger/stranger/resources/variant_catalog_~{fix_assembly}.json > ~{prefix}.str.anno.vcf",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/stranger:v0.10.0.1"
      }
    },
    {
      "id": "task_TIEA_WES",
      "name": "TIEA_WES",
      "groupId": "grp_tiea_wes_10",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "out_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        python /app/TIEA-WES.py -p ~{prefix} -i ~{bam} -o result\n        cp result/~{prefix}.te.result.vcf ~{prefix}.mei.vcf\n    ",
      "runtime": {
        "docker": "docker.schema-bio.com/schemabio/tiea_wes:2.0.1"
      }
    },
    {
      "id": "task_VEP",
      "name": "VEP",
      "groupId": "grp_vep_11",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "cache_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "schema_bundle",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "clinvar_version",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": "20260415",
            "typeHint": "String"
          }
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "out_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        cache_str=\"Uploaded_variation,Location,REF_ALLELE,Allele,Consequence,IMPACT,DOMAINS,Feature,DISTANCE,EXON,INTRON,SYMBOL,STRAND,HGNC_ID,HGVSc,HGVSp,HGVSg,MAX_AF,Protein_position,Amino_acids,Codons,PUBMED,Existing_variation\"\n        custom_str=\"cytoBand,ClinVar_CLNSIG,ClinVar_CLNREVSTAT,ClinVar_CLNDN,ClinVar_CLNSTAR\"\n        gnomad_str=\"GnomAD_AC_joint,GnomAD_AN_joint,GnomAD_AF_joint,GnomAD_AF_joint_eas,GnomAD_nhomalt_joint_XX,GnomAD_nhomalt_joint_XY\"\n        pangolin_str=\"Pangolin_gain_score,Pangolin_loss_score\"\n        evo_str=\"EVOScore2_EVOScore\"\n        am_str=\"AlphaMissense_AM,AlphaMissense_AMC\"\n        self_plugin_str=\"FlankingSequence,MissenseZscore\"\n\n        db_prefix='hg19'\n        if [ \"~{assembly}\" = \"GRCh38\" ]; then\n            db_prefix='hg38'\n        fi\n\n        vep \\\n            --offline --cache \\\n            --dir_cache ~{cache_dir} --merged \\\n            --dir_plugins /opt/vep/.vep/Plugins \\\n            --force_overwrite --fork ~{threads} \\\n            -i ~{vcf} -o ~{prefix}.vep.vcf \\\n            --format vcf --vcf \\\n            --buffer_size 50000 \\\n            --fa ~{ref_dir}/~{fasta} \\\n            --shift_3prime 1 --assembly ~{assembly} --no_escape --check_existing -exclude_predicted --uploaded_allele --show_ref_allele --numbers --domains \\\n            --total_length --hgvs --hgvsg --symbol --ccds --uniprot --max_af --pubmed \\\n            --transcript_filter \"stable_id match N[MR]_\" \\\n            --custom file=~{schema_bundle}/${db_prefix}_clinvar_~{clinvar_version}.vcf.gz,short_name=ClinVar,format=vcf,type=exact,coords=0,fields=CLNSIG%CLNDN%CLNREVSTAT%CLNSTAR \\\n            --custom file=~{schema_bundle}/${db_prefix}_cytoBand.bed.gz,short_name=cytoBand,format=bed,type=overlap,coords=0 \\\n            --custom file=~{schema_bundle}/${db_prefix}_gnomad.v4.1.filtered.vcf.gz,short_name=GnomAD,format=vcf,type=exact,coords=0,fields=AC_joint%AN_joint%AF_joint%AF_joint_eas%nhomalt_joint_XX%nhomalt_joint_XY \\\n            --custom file=~{schema_bundle}/${db_prefix}_pangolin.vcf.gz,short_name=Pangolin,format=vcf,type=exact,coords=0,fields=gain_score%loss_score \\\n            --custom file=~{schema_bundle}/${db_prefix}_EVOScore2.vcf.gz,short_name=EVOScore2,format=vcf,type=exact,coords=0,fields=EVOScore \\\n            --custom file=~{schema_bundle}/${db_prefix}_AlphaMissense.v3.vcf.gz,short_name=AlphaMissense,format=vcf,type=exact,coords=0,fields=AM%AMC \\\n            --plugin FlankingSequence,10 \\\n            --plugin MissenseZscoreTranscript,/opt/vep/.vep/Plugins/missenseByTranscript.hg38.v4.1.bed \\\n            --fields \"${cache_str},${custom_str},${gnomad_str},${pangolin_str},${evo_str},${am_str},${self_plugin_str}\"\n    ",
      "runtime": {
        "cpu": "threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/vep:115.2"
      }
    },
    {
      "id": "task_Whatshap",
      "name": "Whatshap",
      "groupId": "grp_whatshap_12",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "vcf_tbi",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "out_vcf",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        },
        {
          "name": "out_vcf_tbi",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        whatshap phase \\\n            --reference=~{ref_dir}/~{fasta} \\\n            -o ~{prefix}.phase.vcf \\\n            ~{vcf} \\\n            ~{bam}\n        bgzip -f ~{prefix}.phase.vcf\n        tabix -f -p vcf ~{prefix}.phase.vcf.gz\n    ",
      "runtime": {
        "cpu": "threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/whatshap:2.8"
      }
    },
    {
      "id": "task_Xamdst",
      "name": "Xamdst",
      "groupId": "grp_mapping_2",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bam",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bai",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "threads",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "xamdst_report",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          }
        }
      ],
      "command": "        xamdst -1 -p ~{bed} -o result --threads ~{threads} --cutoffdepth 1000 ~{bam}\n        cp result/coverage.report.json ~{prefix}.xamdst.report.json\n    ",
      "runtime": {
        "cpu": "threads",
        "memory": "~{memory_gb}G",
        "docker": "docker.schema-bio.com/schemabio/mapping:v1.0.0"
      }
    }
  ],
  "workflows": [
    {
      "id": "wf_single_wes",
      "name": "SingleWES",
      "inputs": [
        {
          "name": "prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "read_1",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "read_2",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "fasta",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "bed",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "flank_size",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 50,
            "typeHint": "Int"
          }
        },
        {
          "name": "assembly",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "cnvkit_reference",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "sry_sex_cutoff",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 30,
            "typeHint": "Int"
          }
        },
        {
          "name": "cnv_bin_size",
          "type": {
            "kind": "primitive",
            "name": "Int",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 20000,
            "typeHint": "Int"
          }
        },
        {
          "name": "cnv_dup_threshold",
          "type": {
            "kind": "primitive",
            "name": "Float",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 2.5,
            "typeHint": "Float"
          }
        },
        {
          "name": "cnv_del_threshold",
          "type": {
            "kind": "primitive",
            "name": "Float",
            "optional": false
          },
          "optional": false,
          "default": {
            "kind": "literal",
            "value": 1.5,
            "typeHint": "Float"
          }
        },
        {
          "name": "ref_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "cache_dir",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        },
        {
          "name": "schema_bundle",
          "type": {
            "kind": "primitive",
            "name": "Directory",
            "optional": false
          },
          "optional": false
        }
      ],
      "outputs": [
        {
          "name": "summary",
          "type": {
            "kind": "primitive",
            "name": "File",
            "optional": false
          },
          "value": {
            "kind": "raw",
            "text": "write_json(\r\n            PipelineSummary {\r\n                prefix: prefix,\r\n                status: \"Success\",\r\n                pipeline: \"WES_Single\",\r\n                version: \"v0.0.1\",\r\n                bam: Markdup.markdup_bam,\r\n                bai: Markdup.markdup_bai,\r\n                bed: FixBed.fixed_bed,\r\n                qc_result: QCReport.qc_result,\r\n                vcf_raw: LeftAlignAndTrimVariants.left_vcf,\r\n                snp_indel: SNPInDelReport.snp_indel_result,\r\n                mt: MTReport.mt_result,\r\n                cnv_region: CNVAnnoRegion.cnv_anno_result,\r\n                cnv_gene: CNVAnnoGene.cnv_anno_result,\r\n                cnv_raw: CNVKitFix.cnvkit_cnr,\r\n                str: STRReport.str_result,\r\n                mei: MEIReport.mei_result,\r\n                roh: ROHReport.roh_result\r\n            }\r\n        )"
          }
        }
      ],
      "nodes": [
        {
          "kind": "workflow_input",
          "id": "win_prefix",
          "portName": "prefix"
        },
        {
          "kind": "workflow_input",
          "id": "win_read_1",
          "portName": "read_1"
        },
        {
          "kind": "workflow_input",
          "id": "win_read_2",
          "portName": "read_2"
        },
        {
          "kind": "workflow_input",
          "id": "win_fasta",
          "portName": "fasta"
        },
        {
          "kind": "workflow_input",
          "id": "win_bed",
          "portName": "bed"
        },
        {
          "kind": "workflow_input",
          "id": "win_flank_size",
          "portName": "flank_size"
        },
        {
          "kind": "workflow_input",
          "id": "win_assembly",
          "portName": "assembly"
        },
        {
          "kind": "workflow_input",
          "id": "win_cnvkit_reference",
          "portName": "cnvkit_reference"
        },
        {
          "kind": "workflow_input",
          "id": "win_sry_sex_cutoff",
          "portName": "sry_sex_cutoff"
        },
        {
          "kind": "workflow_input",
          "id": "win_cnv_bin_size",
          "portName": "cnv_bin_size"
        },
        {
          "kind": "workflow_input",
          "id": "win_cnv_dup_threshold",
          "portName": "cnv_dup_threshold"
        },
        {
          "kind": "workflow_input",
          "id": "win_cnv_del_threshold",
          "portName": "cnv_del_threshold"
        },
        {
          "kind": "workflow_input",
          "id": "win_ref_dir",
          "portName": "ref_dir"
        },
        {
          "kind": "workflow_input",
          "id": "win_cache_dir",
          "portName": "cache_dir"
        },
        {
          "kind": "workflow_input",
          "id": "win_schema_bundle",
          "portName": "schema_bundle"
        },
        {
          "kind": "decl",
          "id": "decl_ref_fasta_name",
          "name": "ref_fasta_name",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "raw",
            "text": "basename(fasta)"
          },
          "sectionId": "sec_01"
        },
        {
          "kind": "decl",
          "id": "decl_clinvar_version",
          "name": "clinvar_version",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "20260415",
            "typeHint": "String"
          },
          "sectionId": "sec_01"
        },
        {
          "kind": "call",
          "id": "call_FixBed",
          "taskId": "task_FixBed",
          "alias": "FixBed",
          "inputBindings": {
            "bed": {
              "from": {
                "nodeId": "win_bed",
                "port": "bed"
              }
            }
          },
          "sectionId": "sec_01"
        },
        {
          "kind": "call",
          "id": "call_TargetBed",
          "taskId": "task_TargetBed",
          "alias": "TargetBed",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "bed": {
              "from": {
                "nodeId": "call_FixBed",
                "port": "fixed_bed"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            }
          },
          "sectionId": "sec_01"
        },
        {
          "kind": "call",
          "id": "call_Fastp",
          "taskId": "task_Fastp",
          "alias": "Fastp",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "read_1": {
              "from": {
                "nodeId": "win_read_1",
                "port": "read_1"
              }
            },
            "read_2": {
              "from": {
                "nodeId": "win_read_2",
                "port": "read_2"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 16,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_02"
        },
        {
          "kind": "call",
          "id": "call_BwaAlign",
          "taskId": "task_BwaAlign",
          "alias": "BwaAlign",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "read_1": {
              "from": {
                "nodeId": "call_Fastp",
                "port": "clean_read_1"
              }
            },
            "read_2": {
              "from": {
                "nodeId": "call_Fastp",
                "port": "clean_read_2"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            },
            "ref_fasta_name": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 32,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_02"
        },
        {
          "kind": "call",
          "id": "call_Markdup",
          "taskId": "task_SambambaMarkdup",
          "alias": "Markdup",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_BwaAlign",
                "port": "out_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_BwaAlign",
                "port": "out_bai"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 32,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_02"
        },
        {
          "kind": "call",
          "id": "call_SamtoolsSexCheck",
          "taskId": "task_SamtoolsSexCheck",
          "alias": "SamtoolsSexCheck",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            }
          },
          "sectionId": "sec_03"
        },
        {
          "kind": "call",
          "id": "call_Xamdst",
          "taskId": "task_Xamdst",
          "alias": "Xamdst",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "bed": {
              "from": {
                "nodeId": "call_FixBed",
                "port": "fixed_bed"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_03"
        },
        {
          "kind": "call",
          "id": "call_CreateMitoBed",
          "taskId": "task_CreateMitoBed",
          "alias": "CreateMitoBed",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            }
          },
          "sectionId": "sec_03"
        },
        {
          "kind": "decl",
          "id": "decl_mt_xamdst_prefix",
          "name": "mt_xamdst_prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "~{prefix}.mt",
            "typeHint": "String"
          },
          "sectionId": "sec_03"
        },
        {
          "kind": "call",
          "id": "call_MtXamdst",
          "taskId": "task_Xamdst",
          "alias": "MtXamdst",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "decl_mt_xamdst_prefix",
                "port": "mt_xamdst_prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "bed": {
              "from": {
                "nodeId": "call_CreateMitoBed",
                "port": "mito_bed"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_03"
        },
        {
          "kind": "call",
          "id": "call_CollectQCMetrics",
          "taskId": "task_CollectQCMetrics",
          "alias": "CollectQCMetrics",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "bed": {
              "from": {
                "nodeId": "call_FixBed",
                "port": "fixed_bed"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_03"
        },
        {
          "kind": "call",
          "id": "call_FingerPrint",
          "taskId": "task_FingerPrint",
          "alias": "FingerPrint",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 4,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_03"
        },
        {
          "kind": "call",
          "id": "call_QCReport",
          "taskId": "task_QCReport",
          "alias": "QCReport",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "fastp_stats": {
              "from": {
                "nodeId": "call_Fastp",
                "port": "json_report"
              }
            },
            "xamdst_json": {
              "from": {
                "nodeId": "call_Xamdst",
                "port": "xamdst_report"
              }
            },
            "mt_xamdst_json": {
              "from": {
                "nodeId": "call_MtXamdst",
                "port": "xamdst_report"
              }
            },
            "fingerprint_result": {
              "from": {
                "nodeId": "call_FingerPrint",
                "port": "fingerprint_json"
              }
            },
            "gatk_metric": {
              "from": {
                "nodeId": "call_CollectQCMetrics",
                "port": "summary"
              }
            },
            "hs_metric": {
              "from": {
                "nodeId": "call_CollectQCMetrics",
                "port": "hs_metric"
              }
            },
            "sry_result": {
              "from": {
                "nodeId": "call_SamtoolsSexCheck",
                "port": "SRY_count"
              }
            },
            "sry_cutoff": {
              "from": {
                "nodeId": "win_sry_sex_cutoff",
                "port": "sry_sex_cutoff"
              }
            },
            "sambamba_stats": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "sambamba_stats"
              }
            }
          },
          "sectionId": "sec_03"
        },
        {
          "kind": "call",
          "id": "call_DeepVariant",
          "taskId": "task_DeepVariant",
          "alias": "DeepVariant",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "bed": {
              "from": {
                "nodeId": "call_FixBed",
                "port": "fixed_bed"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 16,
              "typeHint": "Int"
            },
            "flank_size": {
              "kind": "literal",
              "value": 50,
              "typeHint": "Int"
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_04"
        },
        {
          "kind": "call",
          "id": "call_SplitVcfHap",
          "taskId": "task_SplitVcf",
          "alias": "SplitVcfHap",
          "inputBindings": {
            "vcf": {
              "from": {
                "nodeId": "call_DeepVariant",
                "port": "vcf"
              }
            }
          },
          "sectionId": "sec_04"
        },
        {
          "kind": "call",
          "id": "call_Whatshap",
          "taskId": "task_Whatshap",
          "alias": "Whatshap",
          "inputBindings": {
            "prefix": {
              "kind": "literal",
              "value": "~{prefix}.part~{i}",
              "typeHint": "String"
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "vcf": {
              "kind": "raw",
              "text": "SplitVcfHap.split_vcfs[i]"
            },
            "vcf_tbi": {
              "kind": "raw",
              "text": "SplitVcfHap.split_vcf_tbis[i]"
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 2,
              "typeHint": "Int"
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_04"
        },
        {
          "kind": "decl",
          "id": "decl_phase_vcf_prefix",
          "name": "phase_vcf_prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "~{prefix}.phase.merged",
            "typeHint": "String"
          },
          "sectionId": "sec_04"
        },
        {
          "kind": "call",
          "id": "call_UniversalMergeVcfsHap",
          "taskId": "task_UniversalMergeVcfs",
          "alias": "UniversalMergeVcfsHap",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "decl_phase_vcf_prefix",
                "port": "phase_vcf_prefix"
              }
            },
            "vcfs": {
              "from": {
                "nodeId": "call_Whatshap",
                "port": "out_vcf"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_04"
        },
        {
          "kind": "call",
          "id": "call_LeftAlignAndTrimVariants",
          "taskId": "task_LeftAlignAndTrimVariants",
          "alias": "LeftAlignAndTrimVariants",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "vcf": {
              "from": {
                "nodeId": "call_UniversalMergeVcfsHap",
                "port": "merged_vcf"
              }
            },
            "vcf_tbi": {
              "from": {
                "nodeId": "call_UniversalMergeVcfsHap",
                "port": "merged_vcf_tbi"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_04"
        },
        {
          "kind": "call",
          "id": "call_SplitVcf",
          "taskId": "task_SplitVcf",
          "alias": "SplitVcf",
          "inputBindings": {
            "vcf": {
              "from": {
                "nodeId": "call_LeftAlignAndTrimVariants",
                "port": "left_vcf"
              }
            }
          },
          "sectionId": "sec_05"
        },
        {
          "kind": "call",
          "id": "call_VEP_Parallel",
          "taskId": "task_VEP",
          "alias": "VEP_Parallel",
          "inputBindings": {
            "prefix": {
              "kind": "literal",
              "value": "~{prefix}.part~{i}",
              "typeHint": "String"
            },
            "vcf": {
              "kind": "raw",
              "text": "SplitVcf.split_vcfs[i]"
            },
            "cache_dir": {
              "from": {
                "nodeId": "win_cache_dir",
                "port": "cache_dir"
              }
            },
            "schema_bundle": {
              "from": {
                "nodeId": "win_schema_bundle",
                "port": "schema_bundle"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 2,
              "typeHint": "Int"
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "clinvar_version": {
              "from": {
                "nodeId": "decl_clinvar_version",
                "port": "clinvar_version"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_05"
        },
        {
          "kind": "decl",
          "id": "decl_merged_vcf_prefix",
          "name": "merged_vcf_prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "~{prefix}.vep.merged",
            "typeHint": "String"
          },
          "sectionId": "sec_05"
        },
        {
          "kind": "call",
          "id": "call_UniversalMergeVcfs",
          "taskId": "task_UniversalMergeVcfs",
          "alias": "UniversalMergeVcfs",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "decl_merged_vcf_prefix",
                "port": "merged_vcf_prefix"
              }
            },
            "vcfs": {
              "from": {
                "nodeId": "call_VEP_Parallel",
                "port": "out_vcf"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_05"
        },
        {
          "kind": "call",
          "id": "call_SNPInDelReport",
          "taskId": "task_SNPInDelReport",
          "alias": "SNPInDelReport",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "vep_vcf": {
              "from": {
                "nodeId": "call_UniversalMergeVcfs",
                "port": "merged_vcf"
              }
            },
            "sry_file": {
              "from": {
                "nodeId": "call_SamtoolsSexCheck",
                "port": "SRY_count"
              }
            },
            "sex_cutoff": {
              "from": {
                "nodeId": "win_sry_sex_cutoff",
                "port": "sry_sex_cutoff"
              }
            }
          },
          "sectionId": "sec_05"
        },
        {
          "kind": "call",
          "id": "call_MitochondrialMutect2",
          "taskId": "task_MitochondrialMutect2",
          "alias": "MitochondrialMutect2",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_06"
        },
        {
          "kind": "decl",
          "id": "decl_mt_vep_prefix",
          "name": "mt_vep_prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "~{prefix}.mt",
            "typeHint": "String"
          },
          "sectionId": "sec_06"
        },
        {
          "kind": "call",
          "id": "call_MtVEP",
          "taskId": "task_VEP",
          "alias": "MtVEP",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "decl_mt_vep_prefix",
                "port": "mt_vep_prefix"
              }
            },
            "vcf": {
              "from": {
                "nodeId": "call_MitochondrialMutect2",
                "port": "vcf"
              }
            },
            "cache_dir": {
              "from": {
                "nodeId": "win_cache_dir",
                "port": "cache_dir"
              }
            },
            "schema_bundle": {
              "from": {
                "nodeId": "win_schema_bundle",
                "port": "schema_bundle"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "clinvar_version": {
              "from": {
                "nodeId": "decl_clinvar_version",
                "port": "clinvar_version"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_06"
        },
        {
          "kind": "call",
          "id": "call_MTReport",
          "taskId": "task_MTReport",
          "alias": "MTReport",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "mt_vep_vcf": {
              "from": {
                "nodeId": "call_MtVEP",
                "port": "out_vcf"
              }
            }
          },
          "sectionId": "sec_06"
        },
        {
          "kind": "call",
          "id": "call_CNVKitAntitarget",
          "taskId": "task_CNVKitAntitarget",
          "alias": "CNVKitAntitarget",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            },
            "target_bed": {
              "from": {
                "nodeId": "call_TargetBed",
                "port": "target_bed"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "call",
          "id": "call_CNVKitCoverage",
          "taskId": "task_CNVKitCoverage",
          "alias": "CNVKitCoverage",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "target_bed": {
              "from": {
                "nodeId": "call_TargetBed",
                "port": "target_bed"
              }
            },
            "antitarget_bed": {
              "from": {
                "nodeId": "call_CNVKitAntitarget",
                "port": "antitarget_bed"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "call",
          "id": "call_CNVKitFix",
          "taskId": "task_CNVKitFix",
          "alias": "CNVKitFix",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "target_coverage": {
              "from": {
                "nodeId": "call_CNVKitCoverage",
                "port": "target_coverage"
              }
            },
            "antitarget_coverage": {
              "from": {
                "nodeId": "call_CNVKitCoverage",
                "port": "antitarget_coverage"
              }
            },
            "reference": {
              "from": {
                "nodeId": "win_cnvkit_reference",
                "port": "cnvkit_reference"
              }
            }
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "call",
          "id": "call_CNVGene",
          "taskId": "task_CNVGene",
          "alias": "CNVGene",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "cnv_cnr": {
              "from": {
                "nodeId": "call_CNVKitFix",
                "port": "cnvkit_cnr"
              }
            },
            "cnv_del_threshold": {
              "from": {
                "nodeId": "win_cnv_del_threshold",
                "port": "cnv_del_threshold"
              }
            },
            "cnv_dup_threshold": {
              "from": {
                "nodeId": "win_cnv_dup_threshold",
                "port": "cnv_dup_threshold"
              }
            }
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "call",
          "id": "call_CNVRegion",
          "taskId": "task_CNVRegion",
          "alias": "CNVRegion",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "cnv_cnr": {
              "from": {
                "nodeId": "call_CNVKitFix",
                "port": "cnvkit_cnr"
              }
            },
            "cnv_del_threshold": {
              "from": {
                "nodeId": "win_cnv_del_threshold",
                "port": "cnv_del_threshold"
              }
            },
            "cnv_dup_threshold": {
              "from": {
                "nodeId": "win_cnv_dup_threshold",
                "port": "cnv_dup_threshold"
              }
            },
            "bin_size": {
              "from": {
                "nodeId": "win_cnv_bin_size",
                "port": "cnv_bin_size"
              }
            }
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "decl",
          "id": "decl_cnv_gene_prefix",
          "name": "cnv_gene_prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "~{prefix}.gene",
            "typeHint": "String"
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "call",
          "id": "call_CNVAnnoGene",
          "taskId": "task_CNVAnno",
          "alias": "CNVAnnoGene",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "decl_cnv_gene_prefix",
                "port": "cnv_gene_prefix"
              }
            },
            "cnv_bed": {
              "from": {
                "nodeId": "call_CNVGene",
                "port": "cnv_result"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            }
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "decl",
          "id": "decl_cnv_region_prefix",
          "name": "cnv_region_prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "~{prefix}.region",
            "typeHint": "String"
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "call",
          "id": "call_CNVAnnoRegion",
          "taskId": "task_CNVAnno",
          "alias": "CNVAnnoRegion",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "decl_cnv_region_prefix",
                "port": "cnv_region_prefix"
              }
            },
            "cnv_bed": {
              "from": {
                "nodeId": "call_CNVRegion",
                "port": "cnv_result"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            }
          },
          "sectionId": "sec_07"
        },
        {
          "kind": "call",
          "id": "call_AutoMap",
          "taskId": "task_AutoMap",
          "alias": "AutoMap",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "vcf": {
              "from": {
                "nodeId": "call_LeftAlignAndTrimVariants",
                "port": "left_vcf"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 4,
              "typeHint": "Int"
            }
          },
          "sectionId": "sec_08"
        },
        {
          "kind": "call",
          "id": "call_ROHReport",
          "taskId": "task_ROHReport",
          "alias": "ROHReport",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "automap_report": {
              "from": {
                "nodeId": "call_AutoMap",
                "port": "combined_tsv"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            }
          },
          "sectionId": "sec_08"
        },
        {
          "kind": "call",
          "id": "call_TIEA_WES",
          "taskId": "task_TIEA_WES",
          "alias": "TIEA_WES",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            }
          },
          "sectionId": "sec_09"
        },
        {
          "kind": "decl",
          "id": "decl_mei_vep_prefix",
          "name": "mei_vep_prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "~{prefix}.mei",
            "typeHint": "String"
          },
          "sectionId": "sec_09"
        },
        {
          "kind": "call",
          "id": "call_MeiVEP",
          "taskId": "task_VEP",
          "alias": "MeiVEP",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "decl_mei_vep_prefix",
                "port": "mei_vep_prefix"
              }
            },
            "vcf": {
              "from": {
                "nodeId": "call_TIEA_WES",
                "port": "out_vcf"
              }
            },
            "cache_dir": {
              "from": {
                "nodeId": "win_cache_dir",
                "port": "cache_dir"
              }
            },
            "schema_bundle": {
              "from": {
                "nodeId": "win_schema_bundle",
                "port": "schema_bundle"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "clinvar_version": {
              "from": {
                "nodeId": "decl_clinvar_version",
                "port": "clinvar_version"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            }
          },
          "sectionId": "sec_09"
        },
        {
          "kind": "call",
          "id": "call_MEIReport",
          "taskId": "task_MEIReport",
          "alias": "MEIReport",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "mei_vcf": {
              "from": {
                "nodeId": "call_MeiVEP",
                "port": "out_vcf"
              }
            }
          },
          "sectionId": "sec_09"
        },
        {
          "kind": "decl",
          "id": "decl_str_prefix",
          "name": "str_prefix",
          "type": {
            "kind": "primitive",
            "name": "String",
            "optional": false
          },
          "expression": {
            "kind": "literal",
            "value": "~{prefix}.str",
            "typeHint": "String"
          },
          "sectionId": "sec_10"
        },
        {
          "kind": "call",
          "id": "call_ExpansionHunter",
          "taskId": "task_ExpansionHunter",
          "alias": "ExpansionHunter",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "decl_str_prefix",
                "port": "str_prefix"
              }
            },
            "bam": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bam"
              }
            },
            "bai": {
              "from": {
                "nodeId": "call_Markdup",
                "port": "markdup_bai"
              }
            },
            "fasta": {
              "from": {
                "nodeId": "decl_ref_fasta_name",
                "port": "ref_fasta_name"
              }
            },
            "sry_file": {
              "from": {
                "nodeId": "call_SamtoolsSexCheck",
                "port": "SRY_count"
              }
            },
            "ref_dir": {
              "from": {
                "nodeId": "win_ref_dir",
                "port": "ref_dir"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            },
            "threads": {
              "kind": "literal",
              "value": 8,
              "typeHint": "Int"
            },
            "sex_cutoff": {
              "from": {
                "nodeId": "win_sry_sex_cutoff",
                "port": "sry_sex_cutoff"
              }
            }
          },
          "sectionId": "sec_10"
        },
        {
          "kind": "call",
          "id": "call_Stranger",
          "taskId": "task_Stranger",
          "alias": "Stranger",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "vcf": {
              "from": {
                "nodeId": "call_ExpansionHunter",
                "port": "str_vcf"
              }
            },
            "assembly": {
              "from": {
                "nodeId": "win_assembly",
                "port": "assembly"
              }
            }
          },
          "sectionId": "sec_10"
        },
        {
          "kind": "call",
          "id": "call_STRReport",
          "taskId": "task_STRReport",
          "alias": "STRReport",
          "inputBindings": {
            "prefix": {
              "from": {
                "nodeId": "win_prefix",
                "port": "prefix"
              }
            },
            "str_vcf": {
              "from": {
                "nodeId": "call_Stranger",
                "port": "anno_vcf"
              }
            }
          },
          "sectionId": "sec_10"
        }
      ],
      "edges": [
        {
          "id": "e_1",
          "source": "win_bed",
          "sourceHandle": "bed",
          "target": "call_FixBed",
          "targetHandle": "bed"
        },
        {
          "id": "e_2",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_TargetBed",
          "targetHandle": "prefix"
        },
        {
          "id": "e_3",
          "source": "call_FixBed",
          "sourceHandle": "fixed_bed",
          "target": "call_TargetBed",
          "targetHandle": "bed"
        },
        {
          "id": "e_4",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_TargetBed",
          "targetHandle": "assembly"
        },
        {
          "id": "e_5",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_Fastp",
          "targetHandle": "prefix"
        },
        {
          "id": "e_6",
          "source": "win_read_1",
          "sourceHandle": "read_1",
          "target": "call_Fastp",
          "targetHandle": "read_1"
        },
        {
          "id": "e_7",
          "source": "win_read_2",
          "sourceHandle": "read_2",
          "target": "call_Fastp",
          "targetHandle": "read_2"
        },
        {
          "id": "e_8",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_BwaAlign",
          "targetHandle": "prefix"
        },
        {
          "id": "e_9",
          "source": "call_Fastp",
          "sourceHandle": "clean_read_1",
          "target": "call_BwaAlign",
          "targetHandle": "read_1"
        },
        {
          "id": "e_10",
          "source": "call_Fastp",
          "sourceHandle": "clean_read_2",
          "target": "call_BwaAlign",
          "targetHandle": "read_2"
        },
        {
          "id": "e_11",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_BwaAlign",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_12",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_BwaAlign",
          "targetHandle": "ref_fasta_name"
        },
        {
          "id": "e_13",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_Markdup",
          "targetHandle": "prefix"
        },
        {
          "id": "e_14",
          "source": "call_BwaAlign",
          "sourceHandle": "out_bam",
          "target": "call_Markdup",
          "targetHandle": "bam"
        },
        {
          "id": "e_15",
          "source": "call_BwaAlign",
          "sourceHandle": "out_bai",
          "target": "call_Markdup",
          "targetHandle": "bai"
        },
        {
          "id": "e_16",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_SamtoolsSexCheck",
          "targetHandle": "prefix"
        },
        {
          "id": "e_17",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_SamtoolsSexCheck",
          "targetHandle": "bam"
        },
        {
          "id": "e_18",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_SamtoolsSexCheck",
          "targetHandle": "bai"
        },
        {
          "id": "e_19",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_SamtoolsSexCheck",
          "targetHandle": "assembly"
        },
        {
          "id": "e_20",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_Xamdst",
          "targetHandle": "prefix"
        },
        {
          "id": "e_21",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_Xamdst",
          "targetHandle": "bam"
        },
        {
          "id": "e_22",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_Xamdst",
          "targetHandle": "bai"
        },
        {
          "id": "e_23",
          "source": "call_FixBed",
          "sourceHandle": "fixed_bed",
          "target": "call_Xamdst",
          "targetHandle": "bed"
        },
        {
          "id": "e_24",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_CreateMitoBed",
          "targetHandle": "prefix"
        },
        {
          "id": "e_25",
          "source": "decl_mt_xamdst_prefix",
          "sourceHandle": "mt_xamdst_prefix",
          "target": "call_MtXamdst",
          "targetHandle": "prefix"
        },
        {
          "id": "e_26",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_MtXamdst",
          "targetHandle": "bam"
        },
        {
          "id": "e_27",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_MtXamdst",
          "targetHandle": "bai"
        },
        {
          "id": "e_28",
          "source": "call_CreateMitoBed",
          "sourceHandle": "mito_bed",
          "target": "call_MtXamdst",
          "targetHandle": "bed"
        },
        {
          "id": "e_29",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_CollectQCMetrics",
          "targetHandle": "prefix"
        },
        {
          "id": "e_30",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_CollectQCMetrics",
          "targetHandle": "bam"
        },
        {
          "id": "e_31",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_CollectQCMetrics",
          "targetHandle": "bai"
        },
        {
          "id": "e_32",
          "source": "call_FixBed",
          "sourceHandle": "fixed_bed",
          "target": "call_CollectQCMetrics",
          "targetHandle": "bed"
        },
        {
          "id": "e_33",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_CollectQCMetrics",
          "targetHandle": "fasta"
        },
        {
          "id": "e_34",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_CollectQCMetrics",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_35",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_FingerPrint",
          "targetHandle": "prefix"
        },
        {
          "id": "e_36",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_FingerPrint",
          "targetHandle": "fasta"
        },
        {
          "id": "e_37",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_FingerPrint",
          "targetHandle": "bam"
        },
        {
          "id": "e_38",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_FingerPrint",
          "targetHandle": "bai"
        },
        {
          "id": "e_39",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_FingerPrint",
          "targetHandle": "assembly"
        },
        {
          "id": "e_40",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_FingerPrint",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_41",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_QCReport",
          "targetHandle": "prefix"
        },
        {
          "id": "e_42",
          "source": "call_Fastp",
          "sourceHandle": "json_report",
          "target": "call_QCReport",
          "targetHandle": "fastp_stats"
        },
        {
          "id": "e_43",
          "source": "call_Xamdst",
          "sourceHandle": "xamdst_report",
          "target": "call_QCReport",
          "targetHandle": "xamdst_json"
        },
        {
          "id": "e_44",
          "source": "call_MtXamdst",
          "sourceHandle": "xamdst_report",
          "target": "call_QCReport",
          "targetHandle": "mt_xamdst_json"
        },
        {
          "id": "e_45",
          "source": "call_FingerPrint",
          "sourceHandle": "fingerprint_json",
          "target": "call_QCReport",
          "targetHandle": "fingerprint_result"
        },
        {
          "id": "e_46",
          "source": "call_CollectQCMetrics",
          "sourceHandle": "summary",
          "target": "call_QCReport",
          "targetHandle": "gatk_metric"
        },
        {
          "id": "e_47",
          "source": "call_CollectQCMetrics",
          "sourceHandle": "hs_metric",
          "target": "call_QCReport",
          "targetHandle": "hs_metric"
        },
        {
          "id": "e_48",
          "source": "call_SamtoolsSexCheck",
          "sourceHandle": "SRY_count",
          "target": "call_QCReport",
          "targetHandle": "sry_result"
        },
        {
          "id": "e_49",
          "source": "win_sry_sex_cutoff",
          "sourceHandle": "sry_sex_cutoff",
          "target": "call_QCReport",
          "targetHandle": "sry_cutoff"
        },
        {
          "id": "e_50",
          "source": "call_Markdup",
          "sourceHandle": "sambamba_stats",
          "target": "call_QCReport",
          "targetHandle": "sambamba_stats"
        },
        {
          "id": "e_51",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_DeepVariant",
          "targetHandle": "prefix"
        },
        {
          "id": "e_52",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_DeepVariant",
          "targetHandle": "bam"
        },
        {
          "id": "e_53",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_DeepVariant",
          "targetHandle": "bai"
        },
        {
          "id": "e_54",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_DeepVariant",
          "targetHandle": "fasta"
        },
        {
          "id": "e_55",
          "source": "call_FixBed",
          "sourceHandle": "fixed_bed",
          "target": "call_DeepVariant",
          "targetHandle": "bed"
        },
        {
          "id": "e_56",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_DeepVariant",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_57",
          "source": "call_DeepVariant",
          "sourceHandle": "vcf",
          "target": "call_SplitVcfHap",
          "targetHandle": "vcf"
        },
        {
          "id": "e_58",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_Whatshap",
          "targetHandle": "bam"
        },
        {
          "id": "e_59",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_Whatshap",
          "targetHandle": "bai"
        },
        {
          "id": "e_60",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_Whatshap",
          "targetHandle": "fasta"
        },
        {
          "id": "e_61",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_Whatshap",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_62",
          "source": "decl_phase_vcf_prefix",
          "sourceHandle": "phase_vcf_prefix",
          "target": "call_UniversalMergeVcfsHap",
          "targetHandle": "prefix"
        },
        {
          "id": "e_63",
          "source": "call_Whatshap",
          "sourceHandle": "out_vcf",
          "target": "call_UniversalMergeVcfsHap",
          "targetHandle": "vcfs"
        },
        {
          "id": "e_64",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_LeftAlignAndTrimVariants",
          "targetHandle": "prefix"
        },
        {
          "id": "e_65",
          "source": "call_UniversalMergeVcfsHap",
          "sourceHandle": "merged_vcf",
          "target": "call_LeftAlignAndTrimVariants",
          "targetHandle": "vcf"
        },
        {
          "id": "e_66",
          "source": "call_UniversalMergeVcfsHap",
          "sourceHandle": "merged_vcf_tbi",
          "target": "call_LeftAlignAndTrimVariants",
          "targetHandle": "vcf_tbi"
        },
        {
          "id": "e_67",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_LeftAlignAndTrimVariants",
          "targetHandle": "fasta"
        },
        {
          "id": "e_68",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_LeftAlignAndTrimVariants",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_69",
          "source": "call_LeftAlignAndTrimVariants",
          "sourceHandle": "left_vcf",
          "target": "call_SplitVcf",
          "targetHandle": "vcf"
        },
        {
          "id": "e_70",
          "source": "win_cache_dir",
          "sourceHandle": "cache_dir",
          "target": "call_VEP_Parallel",
          "targetHandle": "cache_dir"
        },
        {
          "id": "e_71",
          "source": "win_schema_bundle",
          "sourceHandle": "schema_bundle",
          "target": "call_VEP_Parallel",
          "targetHandle": "schema_bundle"
        },
        {
          "id": "e_72",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_VEP_Parallel",
          "targetHandle": "assembly"
        },
        {
          "id": "e_73",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_VEP_Parallel",
          "targetHandle": "fasta"
        },
        {
          "id": "e_74",
          "source": "decl_clinvar_version",
          "sourceHandle": "clinvar_version",
          "target": "call_VEP_Parallel",
          "targetHandle": "clinvar_version"
        },
        {
          "id": "e_75",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_VEP_Parallel",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_76",
          "source": "decl_merged_vcf_prefix",
          "sourceHandle": "merged_vcf_prefix",
          "target": "call_UniversalMergeVcfs",
          "targetHandle": "prefix"
        },
        {
          "id": "e_77",
          "source": "call_VEP_Parallel",
          "sourceHandle": "out_vcf",
          "target": "call_UniversalMergeVcfs",
          "targetHandle": "vcfs"
        },
        {
          "id": "e_78",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_SNPInDelReport",
          "targetHandle": "prefix"
        },
        {
          "id": "e_79",
          "source": "call_UniversalMergeVcfs",
          "sourceHandle": "merged_vcf",
          "target": "call_SNPInDelReport",
          "targetHandle": "vep_vcf"
        },
        {
          "id": "e_80",
          "source": "call_SamtoolsSexCheck",
          "sourceHandle": "SRY_count",
          "target": "call_SNPInDelReport",
          "targetHandle": "sry_file"
        },
        {
          "id": "e_81",
          "source": "win_sry_sex_cutoff",
          "sourceHandle": "sry_sex_cutoff",
          "target": "call_SNPInDelReport",
          "targetHandle": "sex_cutoff"
        },
        {
          "id": "e_82",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_MitochondrialMutect2",
          "targetHandle": "prefix"
        },
        {
          "id": "e_83",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_MitochondrialMutect2",
          "targetHandle": "bam"
        },
        {
          "id": "e_84",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_MitochondrialMutect2",
          "targetHandle": "bai"
        },
        {
          "id": "e_85",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_MitochondrialMutect2",
          "targetHandle": "fasta"
        },
        {
          "id": "e_86",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_MitochondrialMutect2",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_87",
          "source": "decl_mt_vep_prefix",
          "sourceHandle": "mt_vep_prefix",
          "target": "call_MtVEP",
          "targetHandle": "prefix"
        },
        {
          "id": "e_88",
          "source": "call_MitochondrialMutect2",
          "sourceHandle": "vcf",
          "target": "call_MtVEP",
          "targetHandle": "vcf"
        },
        {
          "id": "e_89",
          "source": "win_cache_dir",
          "sourceHandle": "cache_dir",
          "target": "call_MtVEP",
          "targetHandle": "cache_dir"
        },
        {
          "id": "e_90",
          "source": "win_schema_bundle",
          "sourceHandle": "schema_bundle",
          "target": "call_MtVEP",
          "targetHandle": "schema_bundle"
        },
        {
          "id": "e_91",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_MtVEP",
          "targetHandle": "assembly"
        },
        {
          "id": "e_92",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_MtVEP",
          "targetHandle": "fasta"
        },
        {
          "id": "e_93",
          "source": "decl_clinvar_version",
          "sourceHandle": "clinvar_version",
          "target": "call_MtVEP",
          "targetHandle": "clinvar_version"
        },
        {
          "id": "e_94",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_MtVEP",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_95",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_MTReport",
          "targetHandle": "prefix"
        },
        {
          "id": "e_96",
          "source": "call_MtVEP",
          "sourceHandle": "out_vcf",
          "target": "call_MTReport",
          "targetHandle": "mt_vep_vcf"
        },
        {
          "id": "e_97",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_CNVKitAntitarget",
          "targetHandle": "prefix"
        },
        {
          "id": "e_98",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_CNVKitAntitarget",
          "targetHandle": "fasta"
        },
        {
          "id": "e_99",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_CNVKitAntitarget",
          "targetHandle": "assembly"
        },
        {
          "id": "e_100",
          "source": "call_TargetBed",
          "sourceHandle": "target_bed",
          "target": "call_CNVKitAntitarget",
          "targetHandle": "target_bed"
        },
        {
          "id": "e_101",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_CNVKitAntitarget",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_102",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_CNVKitCoverage",
          "targetHandle": "prefix"
        },
        {
          "id": "e_103",
          "source": "call_TargetBed",
          "sourceHandle": "target_bed",
          "target": "call_CNVKitCoverage",
          "targetHandle": "target_bed"
        },
        {
          "id": "e_104",
          "source": "call_CNVKitAntitarget",
          "sourceHandle": "antitarget_bed",
          "target": "call_CNVKitCoverage",
          "targetHandle": "antitarget_bed"
        },
        {
          "id": "e_105",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_CNVKitCoverage",
          "targetHandle": "bam"
        },
        {
          "id": "e_106",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_CNVKitCoverage",
          "targetHandle": "bai"
        },
        {
          "id": "e_107",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_CNVKitFix",
          "targetHandle": "prefix"
        },
        {
          "id": "e_108",
          "source": "call_CNVKitCoverage",
          "sourceHandle": "target_coverage",
          "target": "call_CNVKitFix",
          "targetHandle": "target_coverage"
        },
        {
          "id": "e_109",
          "source": "call_CNVKitCoverage",
          "sourceHandle": "antitarget_coverage",
          "target": "call_CNVKitFix",
          "targetHandle": "antitarget_coverage"
        },
        {
          "id": "e_110",
          "source": "win_cnvkit_reference",
          "sourceHandle": "cnvkit_reference",
          "target": "call_CNVKitFix",
          "targetHandle": "reference"
        },
        {
          "id": "e_111",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_CNVGene",
          "targetHandle": "prefix"
        },
        {
          "id": "e_112",
          "source": "call_CNVKitFix",
          "sourceHandle": "cnvkit_cnr",
          "target": "call_CNVGene",
          "targetHandle": "cnv_cnr"
        },
        {
          "id": "e_113",
          "source": "win_cnv_del_threshold",
          "sourceHandle": "cnv_del_threshold",
          "target": "call_CNVGene",
          "targetHandle": "cnv_del_threshold"
        },
        {
          "id": "e_114",
          "source": "win_cnv_dup_threshold",
          "sourceHandle": "cnv_dup_threshold",
          "target": "call_CNVGene",
          "targetHandle": "cnv_dup_threshold"
        },
        {
          "id": "e_115",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_CNVRegion",
          "targetHandle": "prefix"
        },
        {
          "id": "e_116",
          "source": "call_CNVKitFix",
          "sourceHandle": "cnvkit_cnr",
          "target": "call_CNVRegion",
          "targetHandle": "cnv_cnr"
        },
        {
          "id": "e_117",
          "source": "win_cnv_del_threshold",
          "sourceHandle": "cnv_del_threshold",
          "target": "call_CNVRegion",
          "targetHandle": "cnv_del_threshold"
        },
        {
          "id": "e_118",
          "source": "win_cnv_dup_threshold",
          "sourceHandle": "cnv_dup_threshold",
          "target": "call_CNVRegion",
          "targetHandle": "cnv_dup_threshold"
        },
        {
          "id": "e_119",
          "source": "win_cnv_bin_size",
          "sourceHandle": "cnv_bin_size",
          "target": "call_CNVRegion",
          "targetHandle": "bin_size"
        },
        {
          "id": "e_120",
          "source": "decl_cnv_gene_prefix",
          "sourceHandle": "cnv_gene_prefix",
          "target": "call_CNVAnnoGene",
          "targetHandle": "prefix"
        },
        {
          "id": "e_121",
          "source": "call_CNVGene",
          "sourceHandle": "cnv_result",
          "target": "call_CNVAnnoGene",
          "targetHandle": "cnv_bed"
        },
        {
          "id": "e_122",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_CNVAnnoGene",
          "targetHandle": "assembly"
        },
        {
          "id": "e_123",
          "source": "decl_cnv_region_prefix",
          "sourceHandle": "cnv_region_prefix",
          "target": "call_CNVAnnoRegion",
          "targetHandle": "prefix"
        },
        {
          "id": "e_124",
          "source": "call_CNVRegion",
          "sourceHandle": "cnv_result",
          "target": "call_CNVAnnoRegion",
          "targetHandle": "cnv_bed"
        },
        {
          "id": "e_125",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_CNVAnnoRegion",
          "targetHandle": "assembly"
        },
        {
          "id": "e_126",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_AutoMap",
          "targetHandle": "prefix"
        },
        {
          "id": "e_127",
          "source": "call_LeftAlignAndTrimVariants",
          "sourceHandle": "left_vcf",
          "target": "call_AutoMap",
          "targetHandle": "vcf"
        },
        {
          "id": "e_128",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_AutoMap",
          "targetHandle": "assembly"
        },
        {
          "id": "e_129",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_ROHReport",
          "targetHandle": "prefix"
        },
        {
          "id": "e_130",
          "source": "call_AutoMap",
          "sourceHandle": "combined_tsv",
          "target": "call_ROHReport",
          "targetHandle": "automap_report"
        },
        {
          "id": "e_131",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_ROHReport",
          "targetHandle": "assembly"
        },
        {
          "id": "e_132",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_TIEA_WES",
          "targetHandle": "prefix"
        },
        {
          "id": "e_133",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_TIEA_WES",
          "targetHandle": "bam"
        },
        {
          "id": "e_134",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_TIEA_WES",
          "targetHandle": "bai"
        },
        {
          "id": "e_135",
          "source": "decl_mei_vep_prefix",
          "sourceHandle": "mei_vep_prefix",
          "target": "call_MeiVEP",
          "targetHandle": "prefix"
        },
        {
          "id": "e_136",
          "source": "call_TIEA_WES",
          "sourceHandle": "out_vcf",
          "target": "call_MeiVEP",
          "targetHandle": "vcf"
        },
        {
          "id": "e_137",
          "source": "win_cache_dir",
          "sourceHandle": "cache_dir",
          "target": "call_MeiVEP",
          "targetHandle": "cache_dir"
        },
        {
          "id": "e_138",
          "source": "win_schema_bundle",
          "sourceHandle": "schema_bundle",
          "target": "call_MeiVEP",
          "targetHandle": "schema_bundle"
        },
        {
          "id": "e_139",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_MeiVEP",
          "targetHandle": "assembly"
        },
        {
          "id": "e_140",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_MeiVEP",
          "targetHandle": "fasta"
        },
        {
          "id": "e_141",
          "source": "decl_clinvar_version",
          "sourceHandle": "clinvar_version",
          "target": "call_MeiVEP",
          "targetHandle": "clinvar_version"
        },
        {
          "id": "e_142",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_MeiVEP",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_143",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_MEIReport",
          "targetHandle": "prefix"
        },
        {
          "id": "e_144",
          "source": "call_MeiVEP",
          "sourceHandle": "out_vcf",
          "target": "call_MEIReport",
          "targetHandle": "mei_vcf"
        },
        {
          "id": "e_145",
          "source": "decl_str_prefix",
          "sourceHandle": "str_prefix",
          "target": "call_ExpansionHunter",
          "targetHandle": "prefix"
        },
        {
          "id": "e_146",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bam",
          "target": "call_ExpansionHunter",
          "targetHandle": "bam"
        },
        {
          "id": "e_147",
          "source": "call_Markdup",
          "sourceHandle": "markdup_bai",
          "target": "call_ExpansionHunter",
          "targetHandle": "bai"
        },
        {
          "id": "e_148",
          "source": "decl_ref_fasta_name",
          "sourceHandle": "ref_fasta_name",
          "target": "call_ExpansionHunter",
          "targetHandle": "fasta"
        },
        {
          "id": "e_149",
          "source": "call_SamtoolsSexCheck",
          "sourceHandle": "SRY_count",
          "target": "call_ExpansionHunter",
          "targetHandle": "sry_file"
        },
        {
          "id": "e_150",
          "source": "win_ref_dir",
          "sourceHandle": "ref_dir",
          "target": "call_ExpansionHunter",
          "targetHandle": "ref_dir"
        },
        {
          "id": "e_151",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_ExpansionHunter",
          "targetHandle": "assembly"
        },
        {
          "id": "e_152",
          "source": "win_sry_sex_cutoff",
          "sourceHandle": "sry_sex_cutoff",
          "target": "call_ExpansionHunter",
          "targetHandle": "sex_cutoff"
        },
        {
          "id": "e_153",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_Stranger",
          "targetHandle": "prefix"
        },
        {
          "id": "e_154",
          "source": "call_ExpansionHunter",
          "sourceHandle": "str_vcf",
          "target": "call_Stranger",
          "targetHandle": "vcf"
        },
        {
          "id": "e_155",
          "source": "win_assembly",
          "sourceHandle": "assembly",
          "target": "call_Stranger",
          "targetHandle": "assembly"
        },
        {
          "id": "e_156",
          "source": "win_prefix",
          "sourceHandle": "prefix",
          "target": "call_STRReport",
          "targetHandle": "prefix"
        },
        {
          "id": "e_157",
          "source": "call_Stranger",
          "sourceHandle": "anno_vcf",
          "target": "call_STRReport",
          "targetHandle": "str_vcf"
        }
      ],
      "layout": {
        "win_prefix": {
          "x": 40,
          "y": 40
        },
        "win_read_1": {
          "x": 40,
          "y": 130
        },
        "win_read_2": {
          "x": 40,
          "y": 220
        },
        "win_fasta": {
          "x": 40,
          "y": 310
        },
        "win_bed": {
          "x": 40,
          "y": 400
        },
        "win_flank_size": {
          "x": 40,
          "y": 490
        },
        "win_assembly": {
          "x": 40,
          "y": 580
        },
        "win_cnvkit_reference": {
          "x": 40,
          "y": 670
        },
        "win_sry_sex_cutoff": {
          "x": 40,
          "y": 760
        },
        "win_cnv_bin_size": {
          "x": 40,
          "y": 850
        },
        "win_cnv_dup_threshold": {
          "x": 40,
          "y": 940
        },
        "win_cnv_del_threshold": {
          "x": 40,
          "y": 1030
        },
        "win_ref_dir": {
          "x": 40,
          "y": 1120
        },
        "win_cache_dir": {
          "x": 40,
          "y": 1210
        },
        "win_schema_bundle": {
          "x": 40,
          "y": 1300
        },
        "decl_ref_fasta_name": {
          "x": 280,
          "y": 100
        },
        "decl_clinvar_version": {
          "x": 280,
          "y": 250
        },
        "call_FixBed": {
          "x": 280,
          "y": 400
        },
        "call_TargetBed": {
          "x": 280,
          "y": 550
        },
        "call_Fastp": {
          "x": 620,
          "y": 100
        },
        "call_BwaAlign": {
          "x": 620,
          "y": 250
        },
        "call_Markdup": {
          "x": 620,
          "y": 400
        },
        "call_SamtoolsSexCheck": {
          "x": 960,
          "y": 100
        },
        "call_Xamdst": {
          "x": 960,
          "y": 250
        },
        "call_CreateMitoBed": {
          "x": 960,
          "y": 400
        },
        "decl_mt_xamdst_prefix": {
          "x": 960,
          "y": 550
        },
        "call_MtXamdst": {
          "x": 960,
          "y": 700
        },
        "call_CollectQCMetrics": {
          "x": 960,
          "y": 850
        },
        "call_FingerPrint": {
          "x": 960,
          "y": 1000
        },
        "call_QCReport": {
          "x": 960,
          "y": 1150
        },
        "call_DeepVariant": {
          "x": 1300,
          "y": 100
        },
        "call_SplitVcfHap": {
          "x": 1300,
          "y": 250
        },
        "call_Whatshap": {
          "x": 1300,
          "y": 400
        },
        "decl_phase_vcf_prefix": {
          "x": 1300,
          "y": 550
        },
        "call_UniversalMergeVcfsHap": {
          "x": 1300,
          "y": 700
        },
        "call_LeftAlignAndTrimVariants": {
          "x": 1300,
          "y": 850
        },
        "call_SplitVcf": {
          "x": 1640,
          "y": 100
        },
        "call_VEP_Parallel": {
          "x": 1640,
          "y": 250
        },
        "decl_merged_vcf_prefix": {
          "x": 1640,
          "y": 400
        },
        "call_UniversalMergeVcfs": {
          "x": 1640,
          "y": 550
        },
        "call_SNPInDelReport": {
          "x": 1640,
          "y": 700
        },
        "call_MitochondrialMutect2": {
          "x": 1980,
          "y": 100
        },
        "decl_mt_vep_prefix": {
          "x": 1980,
          "y": 250
        },
        "call_MtVEP": {
          "x": 1980,
          "y": 400
        },
        "call_MTReport": {
          "x": 1980,
          "y": 550
        },
        "call_CNVKitAntitarget": {
          "x": 2320,
          "y": 100
        },
        "call_CNVKitCoverage": {
          "x": 2320,
          "y": 250
        },
        "call_CNVKitFix": {
          "x": 2320,
          "y": 400
        },
        "call_CNVGene": {
          "x": 2320,
          "y": 550
        },
        "call_CNVRegion": {
          "x": 2320,
          "y": 700
        },
        "decl_cnv_gene_prefix": {
          "x": 2320,
          "y": 850
        },
        "call_CNVAnnoGene": {
          "x": 2320,
          "y": 1000
        },
        "decl_cnv_region_prefix": {
          "x": 2320,
          "y": 1150
        },
        "call_CNVAnnoRegion": {
          "x": 2320,
          "y": 1300
        },
        "call_AutoMap": {
          "x": 2660,
          "y": 100
        },
        "call_ROHReport": {
          "x": 2660,
          "y": 250
        },
        "call_TIEA_WES": {
          "x": 3000,
          "y": 100
        },
        "decl_mei_vep_prefix": {
          "x": 3000,
          "y": 250
        },
        "call_MeiVEP": {
          "x": 3000,
          "y": 400
        },
        "call_MEIReport": {
          "x": 3000,
          "y": 550
        },
        "decl_str_prefix": {
          "x": 3340,
          "y": 100
        },
        "call_ExpansionHunter": {
          "x": 3340,
          "y": 250
        },
        "call_Stranger": {
          "x": 3340,
          "y": 400
        },
        "call_STRReport": {
          "x": 3340,
          "y": 550
        }
      },
      "sections": [
        {
          "id": "sec_01",
          "title": "01 · Prep",
          "order": 0
        },
        {
          "id": "sec_02",
          "title": "02 · BAM",
          "order": 1
        },
        {
          "id": "sec_03",
          "title": "03 · QC",
          "order": 2
        },
        {
          "id": "sec_04",
          "title": "04 · SNP Call",
          "order": 3
        },
        {
          "id": "sec_05",
          "title": "05 · SNP Anno",
          "order": 4
        },
        {
          "id": "sec_06",
          "title": "06 · MT",
          "order": 5
        },
        {
          "id": "sec_07",
          "title": "07 · CNV",
          "order": 6
        },
        {
          "id": "sec_08",
          "title": "08 · ROH",
          "order": 7
        },
        {
          "id": "sec_09",
          "title": "09 · MEI",
          "order": 8
        },
        {
          "id": "sec_10",
          "title": "10 · STR",
          "order": 9
        }
      ]
    }
  ],
  "activeWorkflowId": "wf_single_wes"
} as ShowMeProject;
