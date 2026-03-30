// js/appshell.js — injects sidebar + topbar HTML and boots shell

export function renderShell({ title, page }) {
  const shellHTML = `
  <div id="overlay" class="overlay"></div>

  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="logo-text">MAR<span>Xi</span></div>
      <button class="sidebar-toggle" id="sidebarToggle" title="Collapse">◀</button>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">Tools</div>
      <a class="nav-item" href="chat.html" data-page="chat">
        <span class="nav-icon">🧠</span>
        <span class="nav-label">Chat AI</span>
      </a>
      <a class="nav-item" href="website.html" data-page="website">
        <span class="nav-icon">🌐</span>
        <span class="nav-label">Website Builder</span>
      </a>
      <a class="nav-item" href="image.html" data-page="image">
        <span class="nav-icon">🖼️</span>
        <span class="nav-label">Image Gen</span>
      </a>
      <a class="nav-item" href="video.html" data-page="video">
        <span class="nav-icon">🎥</span>
        <span class="nav-label">Video Gen</span>
        <span class="nav-badge">PRO</span>
      </a>
      <div class="nav-section">Account</div>
      <a class="nav-item" href="dashboard.html" data-page="dashboard">
        <span class="nav-icon">📊</span>
        <span class="nav-label">Dashboard</span>
      </a>
      <button class="nav-item" id="logoutBtn">
        <span class="nav-icon">🚪</span>
        <span class="nav-label">Sign Out</span>
      </button>
    </nav>
    <div class="sidebar-user">
      <div class="user-row">
        <div class="user-avatar">M</div>
        <div class="user-info">
          <div class="user-name">Loading…</div>
          <div class="user-plan">free plan</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main area -->
  <div class="main-area">
    <header class="topbar">
      <button class="menu-btn" id="menuBtn">☰</button>
      <span class="topbar-title">${title}</span>
      <div class="topbar-right">
        <span class="usage-pill" id="usagePill">Loading…</span>
        <a href="dashboard.html" class="btn btn-primary btn-sm" id="upgradeBtn" style="display:none">⚡ Upgrade</a>
      </div>
    </header>
    <div class="page-content" id="pageContent"></div>
  </div>

  <!-- Mobile bottom tabs -->
  <nav class="bottom-tabs">
    <button class="tab-item" data-page="chat" onclick="location.href='chat.html'">
      <span class="tab-icon">🧠</span>Chat
    </button>
    <button class="tab-item" data-page="website" onclick="location.href='website.html'">
      <span class="tab-icon">🌐</span>Build
    </button>
    <button class="tab-item" data-page="image" onclick="location.href='image.html'">
      <span class="tab-icon">🖼️</span>Image
    </button>
    <button class="tab-item" data-page="video" onclick="location.href='video.html'">
      <span class="tab-icon">🎥</span>Video
    </button>
    <button class="tab-item" data-page="dashboard" onclick="location.href='dashboard.html'">
      <span class="tab-icon">📊</span>Dash
    </button>
  </nav>

  <div id="toast"></div>
  `;

  document.getElementById("appRoot").innerHTML = shellHTML;
}
