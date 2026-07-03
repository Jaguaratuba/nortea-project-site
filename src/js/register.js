document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const firstnameInput = document.getElementById("firstname-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    const errorMessage = document.getElementById("error-message");

    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearMessage();

        const firstname = firstnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;

        const errors = getRegisterErrors(firstname, email, password, repeatPassword);

        if (errors.length > 0) {
            showMessage(errors.join(". "), "#f06272");
            return;
        }

        setLoading(true);

        const result = await window.SupabaseAuth.sign_up(email, password, {
            firstname: firstname
        });

        setLoading(false);

        if (!result.success) {
            showMessage(result.error || "Erro ao criar cadastro.", "#f06272");
            return;
        }

        form.reset();

        showMessage(
            "Cadastro criado. Confirme seu email para finalizar o acesso.",
            "#4CAF50"
        );
    });

    function getRegisterErrors(firstname, email, password, repeatPassword) {
        const errors = [];

        clearIncorrectFields();

        if (!firstname) {
            errors.push("Primeiro nome é obrigatório");
            firstnameInput.parentElement.classList.add("incorrect");
        }

        if (!email) {
            errors.push("Email é obrigatório");
            emailInput.parentElement.classList.add("incorrect");
        }

        if (!password) {
            errors.push("Senha é obrigatória");
            passwordInput.parentElement.classList.add("incorrect");
        }

        if (password && password.length < 8) {
            errors.push("A senha precisa ter pelo menos 8 caracteres");
            passwordInput.parentElement.classList.add("incorrect");
        }

        if (password !== repeatPassword) {
            errors.push("As senhas não são iguais");
            passwordInput.parentElement.classList.add("incorrect");
            repeatPasswordInput.parentElement.classList.add("incorrect");
        }

        return errors;
    }

    function clearIncorrectFields() {
        [firstnameInput, emailInput, passwordInput, repeatPasswordInput].forEach((input) => {
            input.parentElement.classList.remove("incorrect");
        });
    }

    function clearMessage() {
        errorMessage.textContent = "";
        errorMessage.style.color = "";
    }

    function showMessage(message, color) {
        errorMessage.textContent = message;
        errorMessage.style.color = color;
    }

    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? "Cadastrando..." : "Cadastrar";
        submitButton.style.opacity = isLoading ? "0.6" : "1";
    }
});