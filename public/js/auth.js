document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const themeToggle = document.getElementById("theme-toggle");
    const rootElement = document.documentElement;
    //put everything up here so it looks cleaner

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
    //ben's code, just moved it up

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
    //ben's toggle for theme

    const signUpForm = document.querySelector(".sign-up form");
    const signInForm = document.querySelector(".sign-in form");

    async function mockHandleLogin(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email === "test@example.com" && password === "123456") {
                    resolve({ success: true, role: "worker", name: "Test User" });
                } else {
                    resolve({ success: false });
                }
            }, 500);
        });
    }
    //mock function from Ben until Kinlo is ready with his

    async function mockHandleSignup(name, email, password, role) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 500);
        });
    }
    //same for this one

    //and now for my part with the event listeners:
    signInForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        //just for preventing the form from refreshing the page

        const email = signInForm.querySelector('input[type="email"]').value.trim();
        const password = signInForm.querySelector('input[type="password"]').value.trim();
        //messy ahh syntax

        const result = await mockHandleLogin(email, password);

        if(result.success) 
        {
            console.log("Log in successful", result);
            alert("Login successful! Welcome back, " + result.name);

            //I will need to redirect he user here
        }
        else
        {
            console.log("Login failed");
            alert("Login failed. Please check your email and password.");
        }
    });
    //this is the event listener for the login form

    signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = signUpForm.querySelector('input[type="text"]').value.trim();
        const email = signUpForm.querySelector('input[type="email"]').value.trim();
        const password = signUpForm.querySelector('input[type="password"]').value.trim();
        const role = "worker";
        //I will leave it like this for now as the default role
        //we need to figure out if employees can sign up as team leads or they need to be
        //promoted

        //this will get replaced after Kinlo does his part:
        const result = await mockHandleSignup(name, email, password, role);

        if(result.success)
        {
            console.log("Sign up successful", result);
            alert("Sign up successful! Welcome, " + name);

            //here I will have to add the redirect for the login view

            container.classList.remove("active");
        }
        else
        {
            console.log("Sign up failed");
            alert("Sign up failed. Please try again with different credentials.");
        }
    });
        
});