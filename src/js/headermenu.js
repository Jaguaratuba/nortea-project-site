document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.getElementById('headerAvatar');
  const menu = document.getElementById('headerMenu');

  if (!avatar || !menu) return;

  // Inicializa o menu "escondido" mas no DOM
  Object.assign(menu.style, {
    opacity: '0',
    transform: 'translateY(-5px) scale(0.95)',
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease, transform 0.2s ease'
  });

  let aberto = false;

  // Ao clicar no avatar
  avatar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!aberto) {
      menu.style.pointerEvents = 'auto';
      menu.style.opacity = '1';
      menu.style.transform = 'translateY(0) scale(1)';
      aberto = true;
    } else {
      fecharMenu();
    }
  });

  // Fecha ao clicar fora
  document.addEventListener('click', fecharMenu);

  function fecharMenu() {
    if (!aberto) return;
    menu.style.pointerEvents = 'none';
    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-5px) scale(0.95)';
    aberto = false;
  }

  // Adiciona efeito de zoom leve nos botões ao hover
  Array.from(menu.children).forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.05)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });
  });

  /* Logout: encerra sessão e redireciona para a página inicial
  const logoutBtn = menu.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      logoutBtn.disabled = true;

      if (window.SupabaseAuth) {
        await window.SupabaseAuth.sign_out();
      }
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userEmail');

      window.location.href = 'index.html';
    });
  }
  */
});