const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.erro) {
          errorMessage = errorData.erro;
        }
      } catch {
        // ignore parse error
      }
      throw new Error(errorMessage);
    }

    // For 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    if (!text) return {} as T;
    
    return JSON.parse(text) as T;
  } catch (error: any) {
    console.error(`[API Error] ${method} ${endpoint}:`, error);
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      throw new Error('Não foi possível conectar ao servidor.');
    }
    throw error;
  }
}
