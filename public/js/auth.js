//auth.js

import config from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");
  const loginForm = document.getElementById("login-form");
  const signInBtn = document.getElementById("sign-in-btn");

  registerBtn.addEventListener("click", () => {
    container.classList.add("active");
  });

  loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
  });

  const handleSignIn = (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    fetch(`${config.backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (typeof data === "object") {
          alert("Token: " + data.token);
        } else {
          alert("Response: " + data);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

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

  if (signInBtn) {
    signInBtn.addEventListener("click", handleSignIn);
  }
});
