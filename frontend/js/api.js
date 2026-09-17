/* ==========================================
   UNIP ACHADOS E PERDIDOS - API CENTRALIZADA (FETCH)
   ========================================== */

const API_BASE_URL = 'http://localhost:8080';

/**
 * Função centralizada para requisições HTTP via Fetch API ao backend Java.
 * @param {string} endpoint Ex: '/login', '/objetos', '/usuarios'
 * @param {object} options Opções nativas do fetch (method, body, headers, etc)
 * @returns {Promise<any>}
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // Se retorno sem conteúdo (204)
    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      const errorMessage = data.erro || data.message || `Erro HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error);
    throw error;
  }
}
