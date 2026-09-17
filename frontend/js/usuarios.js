/* ==========================================
   UNIP ACHADOS E PERDIDOS - USUÁRIOS (ADMIN)
   ========================================== */

let allUsersList = [];

document.addEventListener('DOMContentLoaded', async () => {
  const user = checkAuth(true); // Exige Admin
  if (!user) return;

  renderLayout('Usuários');

  await loadUsersList();

  document.getElementById('usuario-form').addEventListener('submit', handleSaveUser);
});

async function loadUsersList() {
  try {
    const list = await apiRequest('/usuarios');
    allUsersList = (list || []).map(u => ({ ...u, id_usuario: u.id_usuario ?? u.idUsuario ?? u.id }));
    renderUsersTable();
  } catch (err) {
    showToast('error', 'Erro ao carregar lista de usuários.');
  }
}

function renderUsersTable() {
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '';

  if (allUsersList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Nenhum usuário cadastrado.</td></tr>';
    return;
  }

  allUsersList.forEach(u => {
    const id = u.id_usuario ?? u.idUsuario;
    const tipoClass = u.tipo === 'admin' ? 'badge-admin' : 'badge-aluno';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${u.nome}</strong></td>
      <td><code>${u.ra}</code></td>
      <td><span class="badge ${tipoClass}">${u.tipo}</span></td>
      <td style="text-align: right;">
        <button class="btn btn-outline btn-sm" onclick="editUser(${id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser(${id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openUserModal(u = null) {
  const form = document.getElementById('usuario-form');
  form.reset();

  if (u) {
    const id = u.id_usuario ?? u.idUsuario;
    document.getElementById('modal-user-title').textContent = 'Editar Usuário';
    document.getElementById('user-id').value = id;
    document.getElementById('user-ra').value = u.ra || '';
    document.getElementById('user-nome').value = u.nome || '';
    document.getElementById('user-senha').value = u.senha || '';
    document.getElementById('user-tipo').value = String(u.tipo || 'aluno').toLowerCase().trim();
  } else {
    document.getElementById('modal-user-title').textContent = 'Criar Usuário';
    document.getElementById('user-id').value = '';
  }

  openModal('modal-usuario');
}

function editUser(id) {
  const u = allUsersList.find(item => (item.id_usuario ?? item.idUsuario) === id);
  if (u) {
    openUserModal(u);
  }
}

async function handleSaveUser(e) {
  e.preventDefault();

  const id = document.getElementById('user-id').value;
  const ra = document.getElementById('user-ra').value.trim();
  const nome = document.getElementById('user-nome').value.trim();
  const senha = document.getElementById('user-senha').value.trim();
  const tipo = document.getElementById('user-tipo').value;

  if (!ra || !nome || !senha) {
    showToast('error', 'Preencha todos os campos obrigatórios.');
    return;
  }

  const payload = { ra, nome, senha, tipo };
  const btn = document.getElementById('btn-save-user');
  btn.disabled = true;

  try {
    if (id) {
      payload.id_usuario = parseInt(id);
      await apiRequest('/usuarios', {
        method: 'PUT',
        body: payload
      });
      showToast('success', 'Usuário atualizado com sucesso!');
    } else {
      await apiRequest('/usuarios', {
        method: 'POST',
        body: payload
      });
      showToast('success', 'Usuário criado com sucesso!');
    }

    closeModal('modal-usuario');
    await loadUsersList();

  } catch (err) {
    showToast('error', err.message || 'Erro ao salvar usuário.');
  } finally {
    btn.disabled = false;
  }
}

function deleteUser(id) {
  confirmDialog('Tem certeza que deseja excluir este usuário?', async () => {
    try {
      await apiRequest('/usuarios', {
        method: 'DELETE',
        body: { id }
      });
      showToast('success', 'Usuário removido com sucesso!');
      await loadUsersList();
    } catch (err) {
      showToast('error', err.message || 'Erro ao excluir usuário.');
    }
  });
}
