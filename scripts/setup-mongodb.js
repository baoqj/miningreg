// MiningReg MongoDB Setup Script
// MongoDB数据库初始化脚本

// 连接到MiningReg数据库
use('miningreg');

// ================================
// 创建集合和索引 (Collections & Indexes)
// ================================

// 文档内容集合
db.createCollection('documents_content');
db.documents_content.createIndex({ "document_id": 1 }, { unique: true });
db.documents_content.createIndex({ "metadata.jurisdiction": 1 });
db.documents_content.createIndex({ "metadata.language": 1 });
db.documents_content.createIndex({ "metadata.document_type": 1 });
db.documents_content.createIndex({ "metadata.effective_date": 1 });
db.documents_content.createIndex({ "title": "text", "content": "text" });

// LLM对话历史集合
db.createCollection('llm_conversations');
db.llm_conversations.createIndex({ "user_id": 1 });
db.llm_conversations.createIndex({ "project_id": 1 });
db.llm_conversations.createIndex({ "created_at": -1 });
db.llm_conversations.createIndex({ "messages.role": 1 });

// 报告模板集合
db.createCollection('report_templates');
db.report_templates.createIndex({ "type": 1 });
db.report_templates.createIndex({ "jurisdiction": 1 });
db.report_templates.createIndex({ "language": 1 });
db.report_templates.createIndex({ "name": "text", "description": "text" });

// 报告内容集合
db.createCollection('report_contents');
db.report_contents.createIndex({ "report_id": 1 }, { unique: true });
db.report_contents.createIndex({ "project_id": 1 });
db.report_contents.createIndex({ "type": 1 });
db.report_contents.createIndex({ "status": 1 });

// AI生成历史集合
db.createCollection('ai_generation_history');
db.ai_generation_history.createIndex({ "user_id": 1 });
db.ai_generation_history.createIndex({ "type": 1 });
db.ai_generation_history.createIndex({ "created_at": -1 });

// ================================
// 插入基础数据 (Seed Data)
// ================================

// 插入法律文档内容
db.documents_content.insertMany([
  {
    "_id": "doc_impact_assessment_act",
    "document_id": "kb_impact_assessment_act",
    "title": "Impact Assessment Act",
    "content": `An Act respecting impact assessments of certain activities and the prevention of significant adverse environmental effects

WHEREAS the Government of Canada is committed to implementing the United Nations Declaration on the Rights of Indigenous Peoples;

WHEREAS the Government of Canada recognizes that impact assessments contribute to informed decision-making in support of sustainable development;

WHEREAS the Government of Canada is committed to enhancing public participation in impact assessment processes and ensuring that opportunities are provided for meaningful public participation;

WHEREAS the Government of Canada recognizes the importance of cooperation and coordination with provinces and territories in relation to impact assessments;

NOW, THEREFORE, Her Majesty, by and with the advice and consent of the Senate and House of Commons of Canada, enacts as follows:

PART 1
IMPACT ASSESSMENT AGENCY OF CANADA

Establishment
1 The Impact Assessment Agency of Canada is established as a body corporate.

Objects and powers
2 The objects of the Agency are to
(a) conduct impact assessments of designated projects in a predictable and timely manner;
(b) promote uniformity and harmonization in the assessment of environmental effects across Canada;
(c) promote or conduct research in matters relating to impact assessment; and
(d) promote public awareness of matters relating to impact assessment.`,
    "sections": [
      {
        "title": "Part 1 - Impact Assessment Agency of Canada",
        "content": "The Impact Assessment Agency of Canada is established as a body corporate...",
        "subsections": [
          {
            "number": "1",
            "title": "Establishment",
            "content": "The Impact Assessment Agency of Canada is established as a body corporate."
          },
          {
            "number": "2",
            "title": "Objects and powers",
            "content": "The objects of the Agency are to..."
          }
        ]
      }
    ],
    "metadata": {
      "jurisdiction": "federal",
      "language": "en",
      "document_type": "act",
      "effective_date": new Date("2019-08-28"),
      "source_url": "https://laws-lois.justice.gc.ca/eng/acts/I-2.75/"
    },
    "created_at": new Date(),
    "updated_at": new Date()
  },
  {
    "_id": "doc_ontario_mining_act",
    "document_id": "kb_ontario_mining_act",
    "title": "Ontario Mining Act",
    "content": `An Act respecting mining

WHEREAS it is in the public interest to encourage prospecting, staking and exploration for the development of mineral resources;

AND WHEREAS the Crown in right of Ontario is the owner of most mineral rights in Ontario;

AND WHEREAS it is desirable to provide for the orderly development of mineral resources;

THEREFORE, Her Majesty, by and with the advice and consent of the Legislative Assembly of the Province of Ontario, enacts as follows:

PART I
INTERPRETATION

Definitions
1. In this Act,
"claim" means a mining claim recorded under this Act;
"exploration" means any work or activity carried out on, in or under the surface for the purpose of discovering mineral deposits;
"mine" means an opening or excavation in, on or under the ground for the purpose of winning any mineral;
"mineral" means any naturally occurring or native element or compound of elements, whether or not in crystalline form, including...`,
    "sections": [
      {
        "title": "Part I - Interpretation",
        "content": "Definitions and interpretations...",
        "subsections": [
          {
            "number": "1",
            "title": "Definitions",
            "content": "In this Act, 'claim' means a mining claim recorded under this Act..."
          }
        ]
      }
    ],
    "metadata": {
      "jurisdiction": "ontario",
      "language": "en",
      "document_type": "act",
      "effective_date": new Date("1990-01-01"),
      "source_url": "https://www.ontario.ca/laws/statute/90m14"
    },
    "created_at": new Date(),
    "updated_at": new Date()
  }
]);

// 插入报告模板
db.report_templates.insertMany([
  {
    "_id": "template_eia_federal",
    "name": "Federal EIA Report Template",
    "description": "Comprehensive template for federal Environmental Impact Assessment reports",
    "type": "eia",
    "jurisdiction": "federal",
    "language": "en",
    "sections": [
      {
        "id": "executive_summary",
        "title": "Executive Summary",
        "order": 1,
        "required": true,
        "description": "High-level overview of the project and key findings",
        "prompts": [
          {
            "type": "generation",
            "template": "Generate an executive summary for the {project_name} project. Include project overview, key environmental effects, mitigation measures, and overall conclusions. Project details: {project_details}"
          }
        ]
      },
      {
        "id": "project_description",
        "title": "Project Description",
        "order": 2,
        "required": true,
        "description": "Detailed description of the proposed project",
        "subsections": [
          {
            "id": "project_overview",
            "title": "Project Overview",
            "prompts": [
              {
                "type": "generation",
                "template": "Describe the {project_type} project including location, scale, timeline, and key components. Location: {location}, Scale: {scale}"
              }
            ]
          },
          {
            "id": "project_components",
            "title": "Project Components",
            "prompts": [
              {
                "type": "generation",
                "template": "Detail the main components and infrastructure for this {project_type} project: {components}"
              }
            ]
          }
        ]
      },
      {
        "id": "environmental_baseline",
        "title": "Environmental Baseline",
        "order": 3,
        "required": true,
        "description": "Current environmental conditions",
        "subsections": [
          {
            "id": "physical_environment",
            "title": "Physical Environment",
            "prompts": [
              {
                "type": "generation",
                "template": "Describe the physical environment including climate, geology, hydrology, and air quality for the project area: {location}"
              }
            ]
          },
          {
            "id": "biological_environment",
            "title": "Biological Environment",
            "prompts": [
              {
                "type": "generation",
                "template": "Describe the biological environment including flora, fauna, and ecosystems in the project area: {location}"
              }
            ]
          }
        ]
      }
    ],
    "variables": {
      "project_name": "string",
      "project_type": "string",
      "location": "string",
      "scale": "string",
      "project_details": "string",
      "components": "array"
    },
    "created_at": new Date(),
    "updated_at": new Date()
  },
  {
    "_id": "template_compliance_report",
    "name": "Mining Compliance Report Template",
    "description": "Template for mining operation compliance reports",
    "type": "compliance",
    "jurisdiction": "federal",
    "language": "en",
    "sections": [
      {
        "id": "compliance_summary",
        "title": "Compliance Summary",
        "order": 1,
        "required": true,
        "description": "Overview of compliance status",
        "prompts": [
          {
            "type": "generation",
            "template": "Generate a compliance summary for {project_name} covering the reporting period {reporting_period}. Include overall compliance status, key findings, and recommendations."
          }
        ]
      },
      {
        "id": "regulatory_requirements",
        "title": "Regulatory Requirements",
        "order": 2,
        "required": true,
        "description": "Applicable regulations and requirements",
        "prompts": [
          {
            "type": "generation",
            "template": "List and describe the applicable regulatory requirements for this {project_type} operation in {jurisdiction}."
          }
        ]
      }
    ],
    "variables": {
      "project_name": "string",
      "project_type": "string",
      "jurisdiction": "string",
      "reporting_period": "string"
    },
    "created_at": new Date(),
    "updated_at": new Date()
  }
]);

// 插入示例对话历史
db.llm_conversations.insertMany([
  {
    "_id": "conv_example_1",
    "user_id": "user_demo",
    "project_id": "proj_demo",
    "title": "EIA Requirements for Copper Mining",
    "type": "legal_query",
    "messages": [
      {
        "role": "user",
        "content": "What are the federal EIA requirements for a new copper mining project in Ontario?",
        "timestamp": new Date("2024-01-15T10:00:00Z")
      },
      {
        "role": "assistant",
        "content": "Based on the Impact Assessment Act, a copper mining project in Ontario may require a federal environmental impact assessment if it meets certain criteria. Here are the key requirements:\n\n1. **Project Thresholds**: Under the Physical Activities Regulations, a metal mine requires federal assessment if:\n   - The ore production capacity is 5,000 tonnes per day or more\n   - The mine is located on federal lands\n   - The project may cause adverse effects in federal jurisdiction\n\n2. **Assessment Process**: If triggered, the project must undergo:\n   - Initial project description submission\n   - Planning phase with public and Indigenous engagement\n   - Impact statement preparation\n   - Technical review and public comment period\n   - Decision by the Minister\n\n3. **Key Considerations**:\n   - Indigenous consultation requirements\n   - Species at risk assessments\n   - Fisheries and fish habitat impacts\n   - Transboundary effects\n\nWould you like me to elaborate on any specific aspect of these requirements?",
        "timestamp": new Date("2024-01-15T10:00:15Z"),
        "sources": [
          {
            "document_id": "kb_impact_assessment_act",
            "section": "Physical Activities Regulations",
            "relevance_score": 0.95
          }
        ],
        "model_info": {
          "model": "gpt-4",
          "tokens_used": 1250,
          "processing_time_ms": 3200
        }
      }
    ],
    "created_at": new Date("2024-01-15T10:00:00Z"),
    "updated_at": new Date("2024-01-15T10:00:15Z")
  }
]);

// ================================
// 创建数据验证规则 (Validation Rules)
// ================================

// 文档内容验证
db.runCommand({
  collMod: "documents_content",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["document_id", "title", "content", "metadata"],
      properties: {
        document_id: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        title: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        content: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        metadata: {
          bsonType: "object",
          required: ["jurisdiction", "language", "document_type"],
          properties: {
            jurisdiction: {
              enum: ["federal", "ontario", "bc", "alberta", "quebec", "municipal"],
              description: "must be a valid jurisdiction"
            },
            language: {
              enum: ["en", "fr"],
              description: "must be en or fr"
            },
            document_type: {
              enum: ["act", "regulation", "guideline", "policy", "case_law"],
              description: "must be a valid document type"
            }
          }
        }
      }
    }
  }
});

// 对话历史验证
db.runCommand({
  collMod: "llm_conversations",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "messages"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        messages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["role", "content", "timestamp"],
            properties: {
              role: {
                enum: ["user", "assistant", "system"],
                description: "must be a valid role"
              },
              content: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              timestamp: {
                bsonType: "date",
                description: "must be a date and is required"
              }
            }
          }
        }
      }
    }
  }
});

print("MongoDB setup completed successfully!");
print("Collections created: documents_content, llm_conversations, report_templates, report_contents, ai_generation_history");
print("Indexes created for optimal query performance");
print("Validation rules applied to ensure data integrity");
print("Sample data inserted for testing and development");
