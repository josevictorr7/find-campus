/* ==========================================
   UNIP ACHADOS E PERDIDOS - LÓGICA DO DASHBOARD
   ========================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const user = checkAuth(false);
  if (!user) return;

  renderLayout('Dashboard');

  const welcomeTitle = document.getElementById('welcome-title');
  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${user.nome}! 👋`;
  }

  const isAdmin = user.tipo === 'admin';
  if (isAdmin) {
    const cardUsers = document.getElementById('card-usuarios-container');
    if (cardUsers) cardUsers.style.display = 'block';
  }

  try {
    const [objetos, usuarios, devolucoes] = await Promise.all([
      apiRequest('/objetos').catch(() => []),
      isAdmin ? apiRequest('/usuarios').catch(() => []) : Promise.resolve([]),
      isAdmin ? apiRequest('/devolucoes').catch(() => []) : Promise.resolve([]),
    ]);

    const perdidos = objetos.filter(o => o.status === 'Perdido').length;
    const encontrados = objetos.filter(o => o.status === 'Encontrado').length;
    const devolvidos = objetos.filter(o => o.status === 'Devolvido').length;

    document.getElementById('count-perdidos').textContent = perdidos;
    document.getElementById('count-encontrados').textContent = encontrados;
    document.getElementById('count-devolvidos').textContent = devolvidos;
    if (isAdmin) {
      document.getElementById('count-usuarios').textContent = usuarios.length;
    }

    const tbody = document.getElementById('recent-objects-table');
    tbody.innerHTML = '';

    if (!objetos || objetos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Nenhum objeto cadastrado no sistema.</td></tr>';
      return;
    }

    const recent = objetos.slice(0, 5);
    recent.forEach(obj => {
      const badgeClass = obj.status === 'Perdido' ? 'badge-lost' : (obj.status === 'Encontrado' ? 'badge-found' : 'badge-returned');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${obj.nome}</strong></td>
        <td><span class="badge ${badgeClass}">${obj.status}</span></td>
        <td>${obj.local || obj.local_id || '-'}</td>
        <td>${obj.contato || '-'}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    showToast('error', 'Falha ao carregar métricas do servidor.');
  }
});
