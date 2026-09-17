/* ==========================================
   UNIP ACHADOS E PERDIDOS - PERFIL DO USUÁRIO
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const user = checkAuth(false);
  if (!user) return;

  renderLayout('Perfil');

  document.getElementById('prof-ra').value = user.ra || '';
  document.getElementById('prof-nome').value = user.nome || '';
  document.getElementById('prof-tipo').value = (user.tipo || 'aluno').toUpperCase();

  document.getElementById('profile-form').addEventListener('submit', handleSaveProfile);
});

async function handleSaveProfile(e) {
  e.preventDefault();

  const user = getAuthUser();
  if (!user) return;

  const ra = document.getElementById('prof-ra').value.trim();
  const nome = document.getElementById('prof-nome').value.trim();
  const senha = document.getElementById('prof-senha').value.trim();

  if (!ra || !nome || !senha) {
    showToast('error', 'Preencha todos os campos obrigatórios.');
    return;
  }

  const payload = {
    id_usuario: user.id_usuario,
    ra,
    nome,
    senha,
    tipo: user.tipo // Mantém tipo inalterado
  };

  const btn = document.getElementById('btn-save-profile');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  try {
    await apiRequest('/usuarios', {
      method: 'PUT',
      body: payload
    });

    const updatedUser = {
      ...user,
      ra,
      nome
    };

    setAuthUser(updatedUser);
    showToast('success', 'Perfil atualizado com sucesso!');

    setTimeout(() => {
      window.location.reload();
    }, 800);

  } catch (err) {
    showToast('error', err.message || 'Erro ao atualizar perfil.');
    btn.disabled = false;
    btn.textContent = 'Salvar Alterações';
  }
}
