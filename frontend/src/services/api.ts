/**
 * API service layer
 * Handles all API calls to the backend
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { getConfig } from './config'
import type {
  KnowledgeAnalysisResponse,
  DialogueResponse,
  ErrorResponse,
} from '../types'

class ApiService {
  private client: AxiosInstance

  constructor() {
    const config = getConfig()

    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add any auth tokens here if needed
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        // 处理后端的统一响应格式 { code, message, data }
        if (response.data && typeof response.data === 'object' && 'code' in response.data) {
          // 如果响应包含 code 字段，说明是统一响应格式
          if (response.data.code === 0) {
            // 成功：返回 data 字段
            response.data = response.data.data
          } else {
            // 失败：抛出错误
            return Promise.reject(new Error(response.data.message || '请求失败'))
          }
        }
        return response
      },
      (error: AxiosError<ErrorResponse>) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          '请求失败，请稍后重试'
        return Promise.reject(new Error(errorMessage))
      }
    )
  }

  /**
   * Analyze uploaded image and extract knowledge points
   */
  async analyzeImage(imageFile: File): Promise<KnowledgeAnalysisResponse> {
    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const response = await this.client.post<KnowledgeAnalysisResponse>(
        '/analyze/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error, '图片分析失败')
    }
  }

  /**
   * Get AI dialogue response for a knowledge point
   */
  async getDialogueResponse(
    knowledgePointId: string,
    message: string,
    conversationHistory?: Array<{ sender: 'user' | 'ai'; content: string }>,
    knowledgePointTitle?: string,
    knowledgePointDesc?: string
  ): Promise<DialogueResponse> {
    try {
      const response = await this.client.post<DialogueResponse>(
        `/knowledge-points/${knowledgePointId}/dialogue`,
        {
          message,
          conversationHistory,
          knowledgePointTitle,
          knowledgePointDesc,
        }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error, 'AI对话请求失败')
    }
  }

  /**
   * Error handler
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        defaultMessage
      return new Error(message)
    }
    return error instanceof Error ? error : new Error(defaultMessage)
  }
}

export const apiService = new ApiService()

