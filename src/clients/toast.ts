import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type {
  ToastConfig,
  ToastAuthToken,
  ToastError,
  PaginationParams,
  PaginatedResponse,
} from '../types/index.js';

export class ToastClient {
  private axiosInstance: AxiosInstance;
  private authToken?: ToastAuthToken;
  private tokenExpiration?: number;
  private config: ToastConfig;
  private baseURL: string;

  constructor(config: ToastConfig) {
    this.config = config;
    this.baseURL =
      config.environment === 'sandbox'
        ? 'https://ws-sandbox-api.eng.toasttab.com'
        : 'https://ws-api.toasttab.com';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor for auth
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        await this.ensureValidToken();
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken.access_token}`;
        }
        // Add Toast-Restaurant-External-ID header if available
        if (this.config.restaurantGuid) {
          config.headers['Toast-Restaurant-External-ID'] = this.config.restaurantGuid;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Ensure we have a valid authentication token
   */
  private async ensureValidToken(): Promise<void> {
    const now = Date.now();

    // Check if token exists and is still valid (with 5 minute buffer)
    if (this.authToken && this.tokenExpiration && this.tokenExpiration > now + 300000) {
      return;
    }

    // Get new token
    await this.authenticate();
  }

  /**
   * Authenticate with Toast API using client credentials
   */
  private async authenticate(): Promise<void> {
    try {
      const authURL =
        this.config.environment === 'sandbox'
          ? 'https://ws-sandbox-api.eng.toasttab.com/authentication/v1/authentication/login'
          : 'https://ws-api.toasttab.com/authentication/v1/authentication/login';

      const response = await axios.post<ToastAuthToken>(
        authURL,
        {
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
          userAccessType: 'TOAST_MACHINE_CLIENT',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.authToken = response.data;
      // Calculate expiration timestamp
      this.tokenExpiration = Date.now() + this.authToken.expires_in * 1000;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: AxiosError): ToastError {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      return {
        message: data?.message || error.message || 'Unknown error occurred',
        code: data?.code || `HTTP_${status}`,
        status,
        details: data,
      };
    } else if (error.request) {
      return {
        message: 'No response received from Toast API',
        code: 'NO_RESPONSE',
        details: error.message,
      };
    } else {
      return {
        message: error.message || 'Request setup failed',
        code: 'REQUEST_SETUP_ERROR',
        details: error,
      };
    }
  }

  /**
   * Generic GET request with pagination support
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, {
      params,
      ...config,
    });
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, config);
    return response.data;
  }

  /**
   * Paginated GET request helper
   */
  async getPaginated<T>(
    endpoint: string,
    params?: PaginationParams & Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, pageSize = 100, ...otherParams } = params || {};

    const response = await this.get<T[]>(endpoint, {
      page,
      pageSize,
      ...otherParams,
    });

    return {
      data: response,
      page,
      pageSize,
      hasMore: Array.isArray(response) && response.length === pageSize,
    };
  }

  /**
   * Fetch all pages of a paginated endpoint
   */
  async getAllPages<T>(
    endpoint: string,
    params?: PaginationParams & Record<string, any>
  ): Promise<T[]> {
    const allResults: T[] = [];
    let page = 1;
    const pageSize = params?.pageSize || 100;

    while (true) {
      const result = await this.getPaginated<T>(endpoint, {
        ...params,
        page,
        pageSize,
      });

      allResults.push(...result.data);

      if (!result.hasMore) {
        break;
      }

      page++;
    }

    return allResults;
  }

  /**
   * Get the restaurant GUID from config
   */
  getRestaurantGuid(): string {
    if (!this.config.restaurantGuid) {
      throw new Error('Restaurant GUID not configured');
    }
    return this.config.restaurantGuid;
  }

  /**
   * Set restaurant GUID dynamically
   */
  setRestaurantGuid(guid: string): void {
    this.config.restaurantGuid = guid;
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.ensureValidToken();
      return true;
    } catch (error) {
      return false;
    }
  }
}
