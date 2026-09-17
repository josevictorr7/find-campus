/* ==========================================
   UNIP ACHADOS E PERDIDOS - LÓGICA DE CADASTRO
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastro-form');
  const btn = document.getElementById('btn-cadastro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ra = document.getElementById('ra').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmar-senha').value.trim();

    if (!ra || !nome || !senha || !confirmarSenha) {
      showToast('error', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      showToast('error', 'As senhas não coincidem.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Cadastrando...';

    try {
      const res = await apiRequest('/usuarios', {
        method: 'POST',
        body: {
          ra,
          nome,
          senha,
          tipo: 'aluno' // Obrigatoriamente aluno no cadastro público
        }
      });

      showToast('success', 'Cadastro realizado com sucesso! Faça login.');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);

    } catch (err) {
      showToast('error', err.message || 'Erro ao realizar cadastro.');
      btn.disabled = false;
      btn.textContent = 'Concluir Cadastro';
    }
  });
});
