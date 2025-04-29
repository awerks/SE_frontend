function initializeTheme() {
    const themeToggle = document.getElementById("auth-theme-toggle");
    const rootElement = document.documentElement;
    const savedTheme = localStorage.getItem("theme") || "light";

    rootElement.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        const newThemeToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
        
        newThemeToggle.addEventListener("click", () => {
            const currentTheme = rootElement.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            rootElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}

// This is kept for backward compatibility
function initializeTheme2() {
    console.log("Theme initialization delegated to landing.js");
}

export { initializeTheme, initializeTheme2 };