/* ==========================================
   UNIP ACHADOS E PERDIDOS - DEVOLUÇÕES (ADMIN)
   ========================================== */

let allDevolucoes = [];
let allObjetos = [];
let allUsuarios = [];

document.addEventListener('DOMContentLoaded', async () => {
  const user = checkAuth(true); // Exige Admin
  if (!user) return;

  renderLayout('Devoluções');

  await loadDevolucaoData();

  document.getElementById('devolucao-form').addEventListener('submit', handleSaveDevolucao);
});

async function loadDevolucaoData() {
  try {
    const [devs, objs, usrs] = await Promise.all([
      apiRequest('/devolucoes').catch(() => []),
      apiRequest('/objetos').catch(() => []),
      apiRequest('/usuarios').catch(() => [])
    ]);

    allDevolucoes = (devs || []).map(d => ({ ...d, id: d.id }));
    allObjetos = (objs || []).map(o => ({ ...o, id_objeto: o.id_objeto ?? o.idObjeto ?? o.id }));
    allUsuarios = (usrs || []).map(u => ({ ...u, id_usuario: u.id_usuario ?? u.idUsuario ?? u.id }));

    populateOptions();
    renderDevolucoesTable();

  } catch (err) {
    showToast('error', 'Erro ao carregar dados de devoluções.');
  }
}

function populateOptions() {
  const selectObj = document.getElementById('dev-objeto');
  selectObj.innerHTML = '<option value="">Selecione o objeto...</option>';
  allObjetos.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.id_objeto;
    opt.textContent = `${o.nome} [${o.status}] — Local: ${o.local || o.local_id || 'N/A'}`;
    selectObj.appendChild(opt);
  });

  const selectUser = document.getElementById('dev-usuario');
  selectUser.innerHTML = '<option value="">Selecione o usuário...</option>';
  allUsuarios.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id_usuario ?? u.idUsuario;
    opt.textContent = `${u.nome} (RA: ${u.ra})`;
    selectUser.appendChild(opt);
  });
}

function renderDevolucoesTable() {
  const tbody = document.getElementById('devolucoes-table-body');
  tbody.innerHTML = '';

  if (allDevolucoes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhuma devolução registrada.</td></tr>';
    return;
  }

  allDevolucoes.forEach(d => {
    const obj = allObjetos.find(o => o.id_objeto === d.objeto);
    const usr = allUsuarios.find(u => (u.id_usuario ?? u.idUsuario) === d.usuario);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong>${obj ? obj.nome : 'Objeto #' + d.objeto}</strong>
      </td>
      <td>
        <strong>${usr ? usr.nome : 'Usuário #' + d.usuario}</strong>
        ${usr ? '<br><span style="font-size:0.75rem; color:var(--text-muted);">RA: ' + usr.ra + '</span>' : ''}
      </td>
      <td>${formatDate(d.data)}</td>
      <td>${d.observacao || 'Sem observações.'}</td>
      <td style="text-align: right;">
        <button class="btn btn-danger btn-sm" onclick="deleteDevolucao(${d.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openDevolucaoModal() {
  const form = document.getElementById('devolucao-form');
  form.reset();
  document.getElementById('dev-id').value = '';
  openModal('modal-devolucao');
}

async function handleSaveDevolucao(e) {
  e.preventDefault();

  const objeto = parseInt(document.getElementById('dev-objeto').value);
  const usuario = parseInt(document.getElementById('dev-usuario').value);
  const observacao = document.getElementById('dev-observacao').value.trim();

  if (!objeto || !usuario) {
    showToast('error', 'Selecione o objeto e o usuário recebedor.');
    return;
  }

  const btn = document.getElementById('btn-save-dev');
  btn.disabled = true;

  try {
    await apiRequest('/devolucoes', {
      method: 'POST',
      body: { objeto, usuario, observacao }
    });

    // Atualiza status do objeto para 'Devolvido'
    const targetObj = allObjetos.find(o => o.id_objeto === objeto);
    if (targetObj) {
      await apiRequest('/objetos', {
        method: 'PUT',
        body: {
          ...targetObj,
          status: 'Devolvido'
        }
      }).catch(() => {});
    }

    showToast('success', 'Devolução registrada com sucesso!');
    closeModal('modal-devolucao');
    await loadDevolucaoData();

  } catch (err) {
    showToast('error', err.message || 'Erro ao registrar devolução.');
  } finally {
    btn.disabled = false;
  }
}

function deleteDevolucao(id) {
  confirmDialog('Tem certeza que deseja excluir esta devolução?', async () => {
    try {
      await apiRequest('/devolucoes', {
        method: 'DELETE',
        body: { id }
      });
      showToast('success', 'Registro de devolução excluído!');
      await loadDevolucaoData();
    } catch (err) {
      showToast('error', err.message || 'Erro ao excluir registro.');
    }
  });
}
