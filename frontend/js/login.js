/* ==========================================
   UNIP ACHADOS E PERDIDOS - LÓGICA DE LOGIN
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Redireciona se já estiver autenticado
  if (getAuthUser()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form = document.getElementById('login-form');
  const btn = document.getElementById('btn-login');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ra = document.getElementById('ra').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!ra || !senha) {
      showToast('error', 'Preencha todos os campos obrigatórios.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Autenticando...';

    try {
      const user = await apiRequest('/login', {
        method: 'POST',
        body: { ra, senha }
      });

      if (!user || (!user.id_usuario && !user.idUsuario)) {
        throw new Error('Falha ao autenticar.');
      }

      const formattedUser = {
        id_usuario: user.id_usuario ?? user.idUsuario,
        ra: user.ra,
        nome: user.nome,
        tipo: String(user.tipo || 'aluno').toLowerCase().trim()
      };

      setAuthUser(formattedUser);
      showToast('success', `Bem-vindo, ${formattedUser.nome}!`);

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);

    } catch (err) {
      showToast('error', err.message || 'RA ou senha inválidos.');
      btn.disabled = false;
      btn.textContent = 'Entrar no Sistema';
    }
  });
});
