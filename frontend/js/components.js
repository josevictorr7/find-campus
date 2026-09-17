/* ==========================================
   UNIP ACHADOS E PERDIDOS - COMPONENTES UTILITÁRIOS (JS)
   ========================================== */

/**
 * Exibe notificação no estilo Toast
 * @param {'success'|'error'|'warning'} type 
 * @param {string} message 
 */
function showToast(type, message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#fff;cursor:pointer;font-weight:bold;margin-left:1rem;">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/**
 * Abre modal pelo ID
 * @param {string} modalId 
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

/**
 * Fecha modal pelo ID
 * @param {string} modalId 
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

/**
 * Utilitário de confirmação de exclusão
 * @param {string} message 
 * @param {Function} onConfirm 
 */
function confirmDialog(message, onConfirm) {
  if (window.confirm(message)) {
    onConfirm();
  }
}

/**
 * Formata data no formato PT-BR
 * @param {string} dateStr 
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
}
