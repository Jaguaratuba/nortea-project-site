document.addEventListener("DOMContentLoaded", async () => {
    const loginBtn = document.getElementById("loginBtn");
    const headerProfile = document.getElementById("headerProfile");
    const headerAvatarIcon = document.getElementById("headerAvatarIcon");
    const headerAvatarImg = document.getElementById("headerAvatarImg");

    const supabase = window.supabaseClient;
    if (!supabase) return;

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
        if (headerProfile) {
            headerProfile.hidden = true;
            headerProfile.classList.remove("auth-loading");
        }

        if (loginBtn) {
            loginBtn.hidden = false;
            loginBtn.classList.remove("auth-loading");
        }

        return;
    }

    if (loginBtn) {
        loginBtn.hidden = true;
        loginBtn.classList.remove("auth-loading");
    }

    if (headerProfile) {
        headerProfile.hidden = false;
        headerProfile.classList.remove("auth-loading");
    }

    const avatarUrl = user.user_metadata?.avatar_url;

    if (avatarUrl && headerAvatarImg && headerAvatarIcon) {
        headerAvatarImg.src = avatarUrl;
        headerAvatarImg.hidden = false;
        headerAvatarIcon.style.display = "none";
    }
});