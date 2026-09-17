/* ==========================================
   UNIP ACHADOS E PERDIDOS - MEUS OBJETOS
   ========================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const user = checkAuth(false);
  if (!user) return;

  renderLayout('Meus Objetos');

  await loadMyObjects();
});

async function loadMyObjects() {
  const user = getAuthUser();
  if (!user) return;

  try {
    const rawObjects = await apiRequest('/objetos');
    const allObjects = (rawObjects || []).map(o => ({ ...o, id_objeto: o.id_objeto ?? o.idObjeto ?? o.id }));
    const myObjects = allObjects.filter(o => o.usuario === user.id_usuario);

    const tbody = document.getElementById('my-objects-table-body');
    tbody.innerHTML = '';

    if (myObjects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Você ainda não cadastrou nenhum objeto.</td></tr>';
      return;
    }

    myObjects.forEach(obj => {
      const badgeClass = obj.status === 'Perdido' ? 'badge-lost' : (obj.status === 'Encontrado' ? 'badge-found' : 'badge-returned');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${obj.nome}</strong></td>
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
          <a href="objetos.html" class="btn btn-outline btn-sm">Gerenciar no Catálogo</a>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    showToast('error', 'Erro ao carregar seus objetos.');
  }
}
