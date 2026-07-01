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
        if (loginBtn) loginBtn.hidden = false;
        if (headerProfile) headerProfile.hidden = true;
        return;
    }

    if (loginBtn) loginBtn.hidden = true;
    if (headerProfile) headerProfile.hidden = false;

    const avatarUrl = user.user_metadata?.avatar_url;

    if (avatarUrl && headerAvatarImg && headerAvatarIcon) {
        headerAvatarImg.src = avatarUrl;
        headerAvatarImg.hidden = false;
        headerAvatarIcon.style.display = "none";
    }
});