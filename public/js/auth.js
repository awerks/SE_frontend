import { initializeTheme } from "./theme.js";
import { loginUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
    initializeTheme();
});

function initializeUI() {
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const signInBtn = document.getElementById("sign-in-btn");
    const loginForm = document.getElementById("login-form");

    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            container.classList.add("active");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            container.classList.remove("active");
        });
    }

    if (signInBtn && loginForm) {
        signInBtn.addEventListener("click", (event) => handleSignIn(event));
    }
}

function handleSignIn(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!username || !password) {
        alert("Please fill in both username and password.");
        return;
    }

    const data = { username, password };

    loginUser(data, username);
}


// Add functions to handle registration


