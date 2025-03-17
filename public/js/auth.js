import { initializeTheme } from "./theme.js";
import { loginUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
    initializeTheme();
    handleSelectionRoles();
});

function initializeUI() {
    const authContainer = document.getElementById("auth-container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const signInBtn = document.getElementById("sign-in-btn");
    const loginForm = document.getElementById("login-form");

    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            authContainer.classList.add("active");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            authContainer.classList.remove("active");
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


function handleSelectionRoles() {
    // Role selection changes
  
    const roleIcons = document.querySelectorAll(".icon");
    const roleText = document.querySelector(".role-text");
    let selectedRole = "";
  
    roleIcons.forEach(icon => {
      icon.addEventListener("mouseover", function () {
        roleText.textContent = `Select your role: ${this.dataset.role}`;
      });

      icon.addEventListener("click", function (event) {
        event.preventDefault();
        selectedRole = this.dataset.role;
        roleText.textContent = `Select your role: ${selectedRole}`;
      });
    });
}
