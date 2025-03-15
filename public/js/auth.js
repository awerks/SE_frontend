const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});





//toggle for theme

const themeToggle = document.getElementById("theme-toggle");
const rootElement = document.documentElement;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    rootElement.setAttribute("data-theme", savedTheme);
}

themeToggle.addEventListener("click", () => {
    const currentTheme = rootElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    rootElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); 
});