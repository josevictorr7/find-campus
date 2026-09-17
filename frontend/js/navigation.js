/* ==========================================
   UNIP ACHADOS E PERDIDOS - NAVEGAÇÃO / LAYOUT
   ========================================== */

function renderLayout(activePageTitle = '') {
  const user = getAuthUser();
  if (!user) return;

  const isAdmin = user.tipo === 'admin';
  const initial = user.nome ? user.nome.charAt(0).toUpperCase() : 'U';

  const sidebarHTML = `
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo-icon">&#128269;</div>
        <div>
          <div class="sidebar-title">UNIP Achados</div>
          <div class="sidebar-subtitle">${isAdmin ? 'Painel de Gestão' : 'Portal do Aluno'}</div>
        </div>
      </div>

      <div class="sidebar-menu">
        <div class="sidebar-section-title">Navegação</div>
        <a href="dashboard.html" class="nav-item ${activePageTitle === 'Dashboard' ? 'active' : ''}">
          <span>&#128200;</span> Dashboard
        </a>
        <a href="objetos.html" class="nav-item ${activePageTitle === 'Objetos' ? 'active' : ''}">
          <span>&#128230;</span> Objetos
        </a>

        ${!isAdmin ? `
          <a href="meus-objetos.html" class="nav-item ${activePageTitle === 'Meus Objetos' ? 'active' : ''}">
            <span>&#128230;</span> Meus Objetos
          </a>
        ` : ''}

        ${isAdmin ? `
          <a href="devolucoes.html" class="nav-item ${activePageTitle === 'Devoluções' ? 'active' : ''}">
            <span>&#8457;</span> Devoluções
          </a>

          <div class="sidebar-section-title" style="margin-top: 1rem;">Administração</div>
          <a href="usuarios.html" class="nav-item ${activePageTitle === 'Usuários' ? 'active' : ''}">
            <span>&#128101;</span> Usuários
          </a>
        ` : ''}
      </div>

      <div class="sidebar-footer">
        <a href="perfil.html" class="user-profile-summary" style="text-decoration:none; color:inherit;">
          <div class="user-avatar">${initial}</div>
          <div class="user-info">
            <div class="user-name">${user.nome}</div>
            <div class="user-ra">RA: ${user.ra}</div>
          </div>
        </a>
        <button class="btn-logout" onclick="logout()">Sair da conta</button>
      </div>
    </aside>
  `;

  const topHeaderHTML = `
    <header class="top-header">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <button class="mobile-menu-toggle" onclick="toggleSidebar()">&#9776;</button>
        <h2 class="header-title">${activePageTitle}</h2>
      </div>

      <div class="header-actions">
        <span class="badge ${isAdmin ? 'badge-admin' : 'badge-aluno'}">${user.tipo}</span>
        <span style="font-size: 0.85rem; font-weight: 600;">${user.nome}</span>
      </div>
    </header>
  `;

  const layoutContainer = document.getElementById('app-layout');
  if (layoutContainer) {
    layoutContainer.insertAdjacentHTML('afterbegin', sidebarHTML);
    const mainContent = layoutContainer.querySelector('.main-content');
    if (mainContent) {
      mainContent.insertAdjacentHTML('afterbegin', topHeaderHTML);
    }
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}
