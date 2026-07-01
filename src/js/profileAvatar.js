document.addEventListener("DOMContentLoaded", async () => {
    const headerAvatarIcon = document.getElementById("headerAvatarIcon");
    const headerAvatarImg = document.getElementById("headerAvatarImg");
    const avatar = document.getElementById("avatar");
    const avatarIcon = document.getElementById("avatarIcon");
    const avatarImg = document.getElementById("avatarImg");
    const photoInput = document.getElementById("photoInput");

    if (!avatar || !avatarIcon || !avatarImg || !photoInput) return;

    const supabase = window.supabaseClient;

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
        window.location.href = "login.html";
        return;
    }

    const user = userData.user;
    const savedAvatar = user.user_metadata?.avatar_url;

    if (savedAvatar) {
        avatarImg.src = savedAvatar;
        avatarImg.hidden = false;
        avatarIcon.style.display = "none";

        headerAvatarImg.src = savedAvatar;
        headerAvatarImg.hidden = false;
        headerAvatarIcon.style.display = "none";
    }

    avatar.addEventListener("click", () => {
        photoInput.click();
    });

    photoInput.addEventListener("change", async () => {
        const file = photoInput.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Selecione apenas arquivos de imagem.");
            return;
        }

        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
                upsert: true
            });

        if (uploadError) {
            alert("Erro ao enviar imagem: " + uploadError.message);
            return;
        }

        const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                avatar_url: avatarUrl
            }
        });

        if (updateError) {
            alert("Erro ao salvar foto: " + updateError.message);
            return;
        }

        avatarImg.src = avatarUrl;
        avatarImg.hidden = false;
        avatarIcon.style.display = "none";

        headerAvatarImg.src = avatarUrl;
        headerAvatarImg.hidden = false;
        headerAvatarIcon.style.display = "none";
    });
});