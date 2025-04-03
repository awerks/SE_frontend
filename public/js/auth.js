import { initializeTheme } from "./theme.js";
import { loginUser, signupUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  initializeTheme();
  handleSelectionRoles();
});

function initializeUI() {
  const container = document.getElementById("auth-container");
  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");
  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

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
    signInBtn.addEventListener("click", async (event) => handleSignIn(event));
  }

  if (signUpBtn && signupForm) {
    signUpBtn.addEventListener("click", async (event) => handleSignUp(event));
  }
}

async function handleSignIn(event) {
  if (!document.getElementById("login-form").checkValidity()) return;
  event.preventDefault();

  const usernameOrEmailInput = document.getElementById("username_or_email");
  const passwordInput = document.getElementById("password");

  const usernameOrEmail = usernameOrEmailInput ? usernameOrEmailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";
  const data = { usernameOrEmail, password };

  let localStorageData = await loginUser(data)
  saveUserInfo(localStorageData);
}
function saveUserInfo(userData) {
  for (let key in userData) {
    localStorage.setItem(key, userData[key]);
  }
}
async function handleSignUp(event) {

  const signupForm = document.getElementById("signup-form");
  if (!signupForm.checkValidity()) return;
  event.preventDefault();

  const firstName = document.getElementById("signup-firstname").value.trim();
  const lastName = document.getElementById("signup-lastname").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document.getElementById("signup-confirm-password").value.trim();
  const birthdate = document.getElementById("signup-birthdate").value;
  const role = document.querySelector(".icon.selected")?.dataset.role;

  if (!role) return alert("Please select a role.");

  if (password !== confirmPassword) return alert("Passwords do not match.");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return alert("Please enter a valid email address.");

  const data = { firstName, lastName, username, email, password, birthdate, role };
  const signUpBtn = document.getElementById("sign-up-btn");

  try {
    if (signUpBtn) {
      signUpBtn.disabled = true;
      signUpBtn.textContent = "Signing up...";
    }

    const response = await signupUser(data);

    if (response.success) {
      console.log("User: ", response.user);
      alert("Registration successful! Please log in.");
      signupForm.reset();
      document.getElementById("auth-container")?.classList.remove("active");
    }
  } catch (error) {
    alert(error.message || "Registration failed. Please try again.");
  } finally {
    if (signUpBtn) {
      signUpBtn.disabled = false;
      signUpBtn.textContent = "Sign Up";
    }
  }
}

function handleSelectionRoles() {
  const roleIcons = document.querySelectorAll(".icon");
  const roleText = document.querySelector(".role-text");
  let selectedRole = "";

  roleIcons.forEach((icon) => {
    icon.addEventListener("mouseover", function () {
      roleText.textContent = `Select your role: ${this.dataset.role}`;
    });

    icon.addEventListener("click", function (event) {
      event.preventDefault();
      // Remove selected class from all icons
      roleIcons.forEach((i) => i.classList.remove("selected"));
      // Add selected class to clicked icon
      this.classList.add("selected");
      selectedRole = this.dataset.role;
      roleText.textContent = `Selected role: ${selectedRole}`;
    });
  });
}
