document.addEventListener('DOMContentLoaded', ()=> {
    const form = document.getElementById('form');
    const errorMessage = document.getElementById('error-message');
    const newPasswordSection = document.getElementById('new-password-section');
    const newPasswordError = document.getElementById('new-password-error');
    const newPasswordForm = document.getElementById('new-password-form');
    const requestSection = document.getElementById('request-section'); // <--
    const emailInput = document.getElementById('email-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const repeatPasswordInput = document.getElementById('repeat-new-password-input');
    
    let inRecoveryMode = false;

    if (window.SupabaseAuth && window.SupabaseAuth.onAuthStateChange) {
        window.SupabaseAuth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                showNewPasswordView();
            }
        });
    }

    // Detecta token na URL e mostra a view de nova senha
    if (window.location.hash.includes("type=recovery")) {
        showNewPasswordView();
    }

    // ---------- FORM 1: PEDIR EMAIL DE REDEFINIÇÃO ----------
    
    if (form) {
        form.addEventListener('submit', async (e) => { // <--- executa quando o usuário envia o formulário.
            e.preventDefault(); // <--- evita que um formulário seja enviado ou que um link recarregue a página
            if (inRecoveryMode) return; // <-- se estiver no inRecoveryMode o formulario não será enviado novamente

            showMessage(errorMessage, "", ""); // <-- limpa mensagens anteriores
            const email = emailInput.value.trim(); // <-- Pega o valor digitado no campo de e-mail e remove espaços extras.
            
            if (!email) { // <-- Se o campo de e-mail estiver vazio, mostra uma mensagem de erro e para a execução.
                showMessage(errorMessage, "Por favor, insira um email válido.", "red");
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]'); // <-- Seleciona o botão de envio dentro do formulário para mostrar o estado de loading.
            setLoading(submitBtn, true, "Enviar email de recuperação", "Enviando..."); 
            const result = await window.SupabaseAuth.reset_password_for_email(email); // <-- Chama a função de redefinição de senha da Supabase, passando o e-mail do usuário. A função retorna um objeto com informações sobre o resultado da operação.
            console.log(result);
            setLoading(submitBtn, false, "Enviar email de recuperação", "Enviar email de recuperação"); // <-- Reseta o estado de loading do botão e evita clique duplo

            // Mostra feedback (verde = sucesso, vermelho = erro)
            if (result.success) {
                showMessage(
                    errorMessage,
                    "Enviamos um link para o email. Verifique a caixa de entrada.",
                    "#4CAF50"
                );
            } else {
                showMessage(errorMessage, result.error || "Erro ao enviar email", "#ff4444");
            }
        });
    }

    // ---------- FORM 2: DEFINIR NOVA SENHA ----------

    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // <--- Evita que a página recarregue e resete

            showMessage(newPasswordError, "", ""); // <--- Limpa avisos anteriores

            const newPassword = newPasswordInput.value;
            const repeatPassword = repeatPasswordInput.value;

            if (!newPassword || !repeatPassword) { // <--- Validação de campos vazios
                showMessage(newPasswordError, "Por favor, preencha os campos em branco.", "#ff4444");
                return;
            }

            if (newPassword !== repeatPassword) { // <--- Validação se as senhas são iguais
                showMessage(newPasswordError, "Insira a mesma senha nos dois campos.", "#ff4444");
                return;
            }

            // <--- Envia para o Supabase caso os requisitos sejam atendidos
            const submitBtn = newPasswordForm.querySelector('button[type="submit"]');
            setLoading(submitBtn, true, "Redefinir senha", "Atualizando...");

            // <--- Chamando a função no Supabase para atualização de senha
            try {
                const result = await window.SupabaseAuth.update_password(newPassword);
                
                if (result.success) {
                    showMessage(newPasswordError, "Senha alterada com sucesso! Redirecionando...", "#4CAF50");
                    setTimeout(() => {
                        window.location.href = "profile.html"; // <--- Manda pro perfil após 2 segundos
                    }, 2000);
                } else {
                    showMessage(newPasswordError, result.error || "Erro ao atualizar senha.", "#ff4444");
                }
            } catch (error) {
                showMessage(newPasswordError, "Erro inesperado ao atualizar a senha.", "#ff4444");
                console.log(error);
            } finally {
                setLoading(submitBtn, false, "Redefinir senha", "Redefinir senha");
            }
        });
    }

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