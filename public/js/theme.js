function initializeTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const rootElement = document.documentElement;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        rootElement.setAttribute("data-theme", savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = rootElement.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            rootElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}

export { initializeTheme }