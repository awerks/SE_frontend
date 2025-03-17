import { initializeTheme } from "./theme.js";
import { loginUser, signupUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  initializeTheme();
  handleSelectionRoles();
});

function initializeUI() {
  const container = document.getElementById("container");
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
    signInBtn.addEventListener("click", (event) => handleSignIn(event));
  }

  if (signUpBtn && signupForm) {
    signUpBtn.addEventListener("click", (event) => handleSignUp(event));
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

async function handleSignUp(event) {
  event.preventDefault();

  // Get form elements
  const usernameInput = document.getElementById("signup-username");
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");
  const confirmPasswordInput = document.getElementById(
    "signup-confirm-password"
  );
  const selectedRole = document.querySelector(".icon.selected")?.dataset.role;

  // Get form values
  const username = usernameInput ? usernameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";
  const confirmPassword = confirmPasswordInput
    ? confirmPasswordInput.value.trim()
    : "";

  // Client-side validation
  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (!selectedRole) {
    alert("Please select a role.");
    return;
  }

  // Prepare data for API
  const data = {
    username,
    email,
    password,
    role: selectedRole,
  };

  try {
    // Show loading state
    const signUpBtn = document.getElementById("sign-up-btn");
    if (signUpBtn) {
      signUpBtn.disabled = true;
      signUpBtn.textContent = "Signing up...";
    }

    // Call signup API
    const response = await signupUser(data);

    // Handle successful signup
    if (response.success) {
      alert("Registration successful! Please log in.");
      // Reset form
      document.getElementById("signup-form")?.reset();
      // Switch to login view
      document.getElementById("container")?.classList.remove("active");
    }
  } catch (error) {
    // Handle signup error
    alert(error.message || "Registration failed. Please try again.");
  } finally {
    // Reset button state
    const signUpBtn = document.getElementById("sign-up-btn");
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
