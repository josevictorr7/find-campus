/* ==========================================
   UNIP ACHADOS E PERDIDOS - AUTENTICAÇÃO E SESSÃO
   ========================================== */

const STORAGE_KEY = 'tf_auth_user';

/**
 * Obtém o usuário atualmente autenticado no localStorage
 * @returns {object|null}
 */
function getAuthUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const user = JSON.parse(data);
    if (user && user.tipo) {
      user.tipo = String(user.tipo).toLowerCase().trim();
    }
    return user;
  } catch (e) {
    return null;
  }
}

/**
 * Salva o usuário no localStorage
 * @param {object} user 
 */
function setAuthUser(user) {
  if (user && user.tipo) {
    user.tipo = String(user.tipo).toLowerCase().trim();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

/**
 * Efetua o logout do usuário
 */
function logout() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = 'login.html';
}

/**
 * Verifica permissão de acesso e redireciona se necessário.
 * @param {boolean} requireAdmin Se true, exige tipo === 'admin'
 */
function checkAuth(requireAdmin = false) {
  const user = getAuthUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }

  const isAdmin = user.tipo === 'admin';
  if (requireAdmin && !isAdmin) {
    window.location.href = 'dashboard.html';
    return null;
  }

  return user;
}
