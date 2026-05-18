document.addEventListener('DOMContentLoaded', ()=> {
    const form = document.getElementById('form');
    const errorMessage = document.getElementById('error-message');
    const newPasswordSection = document.getElementById('new-password-section');
    const newPasswordError = document.getElementById('new-password-error');
    const newPasswordForm = document.getElementById('new-password-form');
    const requestSession = document.getElementById('request-session');
    const emailInput = document.getElementById('email-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const repeatPasswordInput = document.getElementById('repeat-password-input');
    
    let inRecoveryMode = false;

    if (window.SupabaseAuth && window.SupabaseAuth.onAuthStateChange) {
        window.SupabaseAuth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                showNewPasswordView();
            }
        });
    }

    if (window.location.hash.includes("type=recovery")) {
        showNewPasswordView();
    }

    // ---------- FORM 1: PEDIR EMAIL DE REDEFINIÇÃO ---------- 

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (inRecoveryMode) return;

            showMessage(errorMessage, "", ""); // Limpa mensagens anteriores
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage(errorMessage, "Por favor, insira um email válido.", "red");
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            setLoading(submitBtn, true, "Enviar email de recuperação", "Enviando...");
            const result = await window.SupabaseAuth.reset_password_for_email(email);
            setLoading(submitBtn, false, "Enviar email de recuperação", "Enviar email de recuperação");

            // Mostra feedback (verde = sucesso, vermelho = erro)
            if (result.success) {
                showMessage(
                    errorMessage,
                    "Enviámos um link para o seu email. Verifique a caixa de entrada.",
                    "#4CAF50"
                );
            } else {
                showMessage(errorMessage, result.error || "Erro ao enviar email", "#ff4444");
            }
        });
    }

    // ---------- FORM 2: DEFINIR NOVA SENHA ----------

    

    // ---------- HELPERS ----------

    // Troca a view: esconde o form de email e mostra o form de nova senha
    function showNewPasswordView() {
        inRecoveryMode = true;
        if (requestSection) requestSection.style.display = "none";
        if (newPasswordSection) newPasswordSection.style.display = "";
    }

    // Escreve texto colorido num elemento de mensagem
    function showMessage(el, text, color) {
        if (!el) return;
        el.textContent = text;
        el.style.color = color;
    }

    // Liga/desliga o estado de loading de um botão de submit
    function setLoading(btn, isLoading, idleText, loadingText) {
        if (!btn) return;
        btn.disabled = isLoading;
        btn.textContent = isLoading ? loadingText : idleText;
        btn.style.opacity = isLoading ? "0.6" : "1";
    }
}); 