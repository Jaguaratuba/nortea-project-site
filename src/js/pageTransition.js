const overlay = document.getElementById("page-transition");

window.addEventListener("pageshow", () => {
    overlay.classList.remove("show");
});

document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", e => {

        if (
            link.target === "_blank" ||
            e.ctrlKey ||
            e.metaKey ||
            e.shiftKey ||
            e.altKey
        ) {
            return;
        }

        e.preventDefault();

        overlay.classList.add("show");

        setTimeout(() => {
            window.location.href = link.href;
        }, 120);
    });
});

document.querySelectorAll("button[onclick]").forEach(button => {

    const onclick = button.getAttribute("onclick");

    if (!onclick?.includes("location.href")) return;

    button.addEventListener("click", e => {

        e.preventDefault();

        overlay.classList.add("show");

        const url = onclick.match(/'([^']+)'|"([^"]+)"/);

        if (!url) return;

        setTimeout(() => {
            window.location.href = url[1] || url[2];
        }, 120);
    });
});