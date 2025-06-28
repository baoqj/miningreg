// Hugging Face API Integration for MiningReg
// 集成Hugging Face API实现LLM功能

import { HfInference } from '@huggingface/inference'

// 初始化Hugging Face客户端
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// 支持的模型配置
export const MODELS = {
  // 文本生成模型
  TEXT_GENERATION: {
    DEFAULT: 'microsoft/DialoGPT-large',
    LEGAL: 'microsoft/DialoGPT-large', // 可以替换为法律专用模型
    MULTILINGUAL: 'microsoft/DialoGPT-large'
  },
  // 嵌入模型
  EMBEDDINGS: {
    DEFAULT: 'sentence-transformers/all-MiniLM-L6-v2',
    MULTILINGUAL: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'
  },
  // 问答模型
  QUESTION_ANSWERING: {
    DEFAULT: 'deepset/roberta-base-squad2',
    LEGAL: 'deepset/roberta-base-squad2'
  }
} as const

// LLM响应接口
export interface LLMResponse {
  content: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  sources?: Array<{
    document_id: string
    relevance: number
    content: string
  }>
}

// 文本生成配置
export interface GenerationConfig {
  model?: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  language?: 'en' | 'fr'
  context?: string
  sources?: Array<{
    content: string
    metadata: Record<string, any>
  }>
}

// 主要的文本生成函数
export async function generateText(
  prompt: string,
  config: GenerationConfig = {}
): Promise<LLMResponse> {
  try {
    const {
      model = MODELS.TEXT_GENERATION.DEFAULT,
      max_tokens = 1000,
      temperature = 0.7,
      top_p = 0.9,
      language = 'en',
      context,
      sources
    } = config

    // 构建完整的提示词
    let fullPrompt = prompt

    // 添加上下文信息
    if (context) {
      fullPrompt = `Context: ${context}\n\nQuestion: ${prompt}`
    }

    // 添加来源文档
    if (sources && sources.length > 0) {
      const sourceText = sources
        .map((source, index) => `Source ${index + 1}: ${source.content}`)
        .join('\n\n')
      fullPrompt = `${sourceText}\n\nBased on the above sources, ${prompt}`
    }

    // 添加语言指示
    if (language === 'fr') {
      fullPrompt = `Please respond in French. ${fullPrompt}`
    }

    // 调用Hugging Face API
    const response = await hf.textGeneration({
      model,
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: max_tokens,
        temperature,
        top_p,
        do_sample: true,
        return_full_text: false
      }
    })

    // 估算token使用量（近似值）
    const promptTokens = Math.ceil(fullPrompt.length / 4)
    const completionTokens = Math.ceil(response.generated_text.length / 4)

    return {
      content: response.generated_text.trim(),
      model,
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens
      },
      sources: sources?.map((source, index) => ({
        document_id: source.metadata.document_id || `source_${index}`,
        relevance: source.metadata.relevance || 0.8,
        content: source.content.substring(0, 200) + '...'
      }))
    }
  } catch (error) {
    console.error('Hugging Face API Error:', error)
    throw new Error(`LLM generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// 问答功能
export async function answerQuestion(
  question: string,
  context: string,
  config: Partial<GenerationConfig> = {}
): Promise<LLMResponse> {
  try {
    const model = config.model || MODELS.QUESTION_ANSWERING.DEFAULT

    const response = await hf.questionAnswering({
      model,
      inputs: {
        question,
        context
      }
    })

    return {
      content: response.answer,
      model,
      usage: {
        prompt_tokens: Math.ceil((question.length + context.length) / 4),
        completion_tokens: Math.ceil(response.answer.length / 4),
        total_tokens: Math.ceil((question.length + context.length + response.answer.length) / 4)
      }
    }
  } catch (error) {
    console.error('Question Answering Error:', error)
    throw new Error(`Question answering failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// 生成文档嵌入
export async function generateEmbedding(
  text: string,
  model: string = MODELS.EMBEDDINGS.DEFAULT
): Promise<number[]> {
  try {
    const response = await hf.featureExtraction({
      model,
      inputs: text
    })

    // 确保返回的是数字数组
    if (Array.isArray(response) && Array.isArray(response[0])) {
      return response[0] as number[]
    } else if (Array.isArray(response)) {
      return response as number[]
    } else {
      throw new Error('Unexpected embedding format')
    }
  } catch (error) {
    console.error('Embedding Generation Error:', error)
    throw new Error(`Embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// 批量生成嵌入
export async function generateEmbeddings(
  texts: string[],
  model: string = MODELS.EMBEDDINGS.DEFAULT
): Promise<number[][]> {
  try {
    const embeddings: number[][] = []
    
    // 批量处理，避免API限制
    const batchSize = 10
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      const batchPromises = batch.map(text => generateEmbedding(text, model))
      const batchResults = await Promise.all(batchPromises)
      embeddings.push(...batchResults)
    }

    return embeddings
  } catch (error) {
    console.error('Batch Embedding Generation Error:', error)
    throw new Error(`Batch embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// 法律文档分析专用函数
export async function analyzeLegalDocument(
  document: string,
  query: string,
  jurisdiction: string = 'federal',
  language: 'en' | 'fr' = 'en'
): Promise<LLMResponse> {
  const legalPrompt = language === 'fr' 
    ? `En tant qu'assistant juridique spécialisé en droit minier canadien, analysez le document suivant et répondez à la question dans le contexte de la juridiction ${jurisdiction}.

Document: ${document}

Question: ${query}

Veuillez fournir une réponse détaillée avec des références spécifiques aux sections pertinentes du document.`
    : `As a legal assistant specializing in Canadian mining law, analyze the following document and answer the question in the context of ${jurisdiction} jurisdiction.

Document: ${document}

Question: ${query}

Please provide a detailed response with specific references to relevant sections of the document.`

  return generateText(legalPrompt, {
    model: MODELS.TEXT_GENERATION.LEGAL,
    max_tokens: 1500,
    temperature: 0.3, // 更低的温度以获得更准确的法律分析
    language,
    context: `Legal document analysis for ${jurisdiction} jurisdiction`
  })
}

// EIA报告生成专用函数
export async function generateEIASection(
  sectionType: string,
  projectData: Record<string, any>,
  language: 'en' | 'fr' = 'en'
): Promise<LLMResponse> {
  const eiaPrompt = language === 'fr'
    ? `Générez une section d'évaluation d'impact environnemental (EIE) pour "${sectionType}" basée sur les données de projet suivantes:

Données du projet: ${JSON.stringify(projectData, null, 2)}

Veuillez créer une section complète et professionnelle qui respecte les exigences réglementaires canadiennes pour les EIE.`
    : `Generate an Environmental Impact Assessment (EIA) section for "${sectionType}" based on the following project data:

Project Data: ${JSON.stringify(projectData, null, 2)}

Please create a comprehensive and professional section that meets Canadian regulatory requirements for EIAs.`

  return generateText(eiaPrompt, {
    model: MODELS.TEXT_GENERATION.DEFAULT,
    max_tokens: 2000,
    temperature: 0.4,
    language,
    context: `EIA report generation for ${sectionType}`
  })
}

// 健康检查函数
export async function healthCheck(): Promise<boolean> {
  try {
    const testResponse = await hf.textGeneration({
      model: MODELS.TEXT_GENERATION.DEFAULT,
      inputs: 'Test connection',
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1
      }
    })
    return !!testResponse.generated_text
  } catch (error) {
    console.error('Hugging Face Health Check Failed:', error)
    return false
  }
}

// 导出默认配置
export const defaultConfig: GenerationConfig = {
  model: MODELS.TEXT_GENERATION.DEFAULT,
  max_tokens: 1000,
  temperature: 0.7,
  top_p: 0.9,
  language: 'en'
}
