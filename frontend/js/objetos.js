/* ==========================================
   UNIP ACHADOS E PERDIDOS - LÓGICA DE OBJETOS
   ========================================== */

let allObjects = [];

document.addEventListener('DOMContentLoaded', async () => {
  const user = checkAuth(false);
  if (!user) return;

  renderLayout('Objetos');

  await loadInitialData();

  document.getElementById('search-input').addEventListener('input', filterAndRender);
  document.getElementById('status-filter').addEventListener('change', filterAndRender);

  document.getElementById('objeto-form').addEventListener('submit', handleSaveObject);
});

async function loadInitialData() {
  try {
    const objs = await apiRequest('/objetos').catch(() => []);
    allObjects = (objs || []).map(o => ({ ...o, id_objeto: o.id_objeto ?? o.idObjeto ?? o.id }));
    filterAndRender();

  } catch (err) {
    showToast('error', 'Erro ao carregar lista de objetos.');
  }
}

function filterAndRender() {
  const search = document.getElementById('search-input').value.toLowerCase().trim();
  const status = document.getElementById('status-filter').value;
  const user = getAuthUser();
  const isAdmin = user && user.tipo === 'admin';

  let filtered = allObjects;

  if (status !== 'todos') {
    filtered = filtered.filter(o => o.status === status);
  }

  if (search) {
    filtered = filtered.filter(o => 
      (o.nome && o.nome.toLowerCase().includes(search)) ||
      (o.descricao && o.descricao.toLowerCase().includes(search)) ||
      (o.cor && o.cor.toLowerCase().includes(search)) ||
      (o.marca && o.marca.toLowerCase().includes(search)) ||
      (o.local && o.local.toLowerCase().includes(search))
    );
  }

  const tbody = document.getElementById('objects-table-body');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum objeto encontrado.</td></tr>';
    return;
  }

  filtered.forEach(obj => {
    const badgeClass = obj.status === 'Perdido' ? 'badge-lost' : (obj.status === 'Encontrado' ? 'badge-found' : 'badge-returned');
    const isOwner = user && (obj.usuario === user.id_usuario);
    const canEdit = isAdmin || isOwner;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong>${obj.nome}</strong>
      </td>
      <td><span class="badge ${badgeClass}">${obj.status}</span></td>
      <td>
        <span style="font-size:0.8rem; color:var(--text-muted);">
          ${obj.cor ? 'Cor: ' + obj.cor + ' | ' : ''}
          ${obj.marca ? 'Marca: ' + obj.marca : ''}
        </span>
        <p style="font-size:0.85rem; margin-top:2px;">${obj.descricao || 'Sem descrição.'}</p>
      </td>
      <td>${obj.local || obj.local_id || '-'}</td>
      <td>${obj.contato || '-'}</td>
      <td style="text-align: right;">
        ${canEdit ? `
          <button class="btn btn-outline btn-sm" onclick="editObject(${obj.id_objeto})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteObject(${obj.id_objeto})">Excluir</button>
        ` : '-'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openObjectModal(obj = null) {
  const form = document.getElementById('objeto-form');
  form.reset();

  if (obj) {
    const idObj = obj.id_objeto ?? obj.idObjeto ?? obj.id;
    document.getElementById('modal-objeto-title').textContent = 'Editar Objeto';
    document.getElementById('obj-id').value = idObj;
    document.getElementById('obj-nome').value = obj.nome || '';
    document.getElementById('obj-status').value = obj.status || 'Perdido';
    document.getElementById('obj-cor').value = obj.cor || '';
    document.getElementById('obj-marca').value = obj.marca || '';
    document.getElementById('obj-local').value = obj.local || obj.local_id || '';
    document.getElementById('obj-contato').value = obj.contato || '';
    document.getElementById('obj-descricao').value = obj.descricao || '';
  } else {
    document.getElementById('modal-objeto-title').textContent = 'Registrar Novo Objeto';
    document.getElementById('obj-id').value = '';
  }

  openModal('modal-objeto');
}

function editObject(id) {
  const obj = allObjects.find(o => (o.id_objeto ?? o.idObjeto ?? o.id) === id);
  if (obj) {
    openObjectModal(obj);
  }
}

async function handleSaveObject(e) {
  e.preventDefault();

  const user = getAuthUser();
  if (!user) return;

  const id = document.getElementById('obj-id').value;
  const nome = document.getElementById('obj-nome').value.trim();
  const status = document.getElementById('obj-status').value;
  const cor = document.getElementById('obj-cor').value.trim();
  const marca = document.getElementById('obj-marca').value.trim();
  const local = document.getElementById('obj-local').value;
  const contato = document.getElementById('obj-contato').value.trim();
  const descricao = document.getElementById('obj-descricao').value.trim();

  if (!nome || !status) {
    showToast('error', 'Nome e status são obrigatórios.');
    return;
  }

  const payload = {
    nome,
    status,
    cor,
    marca,
    local,
    contato,
    descricao,
    usuario: user.id_usuario
  };

  const btn = document.getElementById('btn-save-obj');
  btn.disabled = true;

  try {
    if (id) {
      const parsedId = parseInt(id);
      payload.id_objeto = parsedId;
      payload.idObjeto = parsedId;
      payload.id = parsedId;

      await apiRequest('/objetos', {
        method: 'PUT',
        body: payload
      });
      showToast('success', 'Objeto atualizado com sucesso!');
    } else {
      await apiRequest('/objetos', {
        method: 'POST',
        body: payload
      });
      showToast('success', 'Objeto registrado com sucesso!');
    }

    closeModal('modal-objeto');
    await loadInitialData();

  } catch (err) {
    showToast('error', err.message || 'Erro ao salvar objeto.');
  } finally {
    btn.disabled = false;
  }
}

function deleteObject(id) {
  confirmDialog('Tem certeza que deseja excluir este objeto?', async () => {
    try {
      await apiRequest('/objetos', {
        method: 'DELETE',
        body: { id }
      });
      showToast('success', 'Objeto removido com sucesso!');
      await loadInitialData();
    } catch (err) {
      showToast('error', err.message || 'Erro ao excluir objeto.');
    }
  });
}
