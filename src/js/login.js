document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const errorMessage = document.getElementById("error-message");
    const loginBtn = document.getElementById("loginBtn");
    const loginSection = document.querySelector('.login-section');
    const heroTextH2 = document.querySelector('.hero-text h2');
    const submitButton = form.querySelector('button[type="submit"]');

    checkExistingSession();

    form.addEventListener("submit", async(event) => {
        event.preventDefault();

        errorMessage.textContent = "";
        errorMessage.style.color = "";

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError("Email ou senha obrigatórios")
            return
        }

        setLoadingState(true);

        try {
            const result = await window.SupabaseAuth.sign_in(email, password)

            if (result.success) {
                showSuccess("Login realizado com sucesso")
            } else {
                showError(result.error)
            }

        } catch (error) {
            showError("Erro ao conectar com o servidor")
            console.error("Login error", error)
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.color = "#ff4444";
        }

        // Mostra mensagem de sucesso
        function showSuccess(message) {
            errorMessage.textContent = message;
            errorMessage.style.color = "#4CAF50";
        }

        function setLoadingState(isLoading) {
            if (isLoading) {
                submitButton.disabled = true;
                submitButton.textContent = "Entrando...";
                submitButton.style.opacity = "0.6";
            } else {
                submitButton.disabled = false;
                submitButton.textContent = "Login";
                submitButton.style.opacity = "1";
            }
        }
    });

    async function checkExistingSession() {
        const { success, session } = await window.SupabaseAuth.get_session();

        if (success && session) {
            const { user } = await window.SupabaseAuth.get_current_user();
            if (user) {
                handleSuccessfulLogin(user);
            }
        }
    }

    // Manipula login bem-sucedido
    function handleSuccessfulLogin(user) {
        // Salva flag no sessionStorage (backup)
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', user.email);

        // Substitui botão de login pelo avatar
        if (loginBtn) {
            loginBtn.outerHTML = 
            `
                <div class="header-profile">
                    <div class="header-avatar" onclick="window.location.href='profile.html'" style="cursor: pointer;">
                        <i class='bx bx-user'></i>
                    </div>
                </div>
            `
            ;
        }

        // Esconde seção de login
        if (loginSection) {
            loginSection.style.display = 'none';
        }

        // Volta ao topo com scroll suave
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Altera texto do hero com nome do usuário
        if (heroTextH2) {
            const userName = user.user_metadata?.firstname || user.email.split('@')[0];
            heroTextH2.textContent = `Seja bem-vindo ${userName}`;
        }
    }

});