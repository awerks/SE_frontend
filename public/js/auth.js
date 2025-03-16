document.addEventListener("DOMContentLoaded", () => {
    //base URL from Illia
    const BASE_URL = 'https://virtserver.swaggerhub.com/softwareproject-afb/Software_project/1.0.0/';

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

    //the function illia told me to implement to call backend for login
    async function handleLogin(email, password)
    {
        try
        {   //` ` for variable interpolation, didn't know why the code was giving errors
            const response = await fetch(`${BASE_URL}login`, 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password})
            });

            if(!response.ok)
            {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch(error)
        {
            console.error('Error duroing login: ', error);
            return {success: false};
        }
    }

    //same function but for singup with calling backend

    async function handleSignup(name, email, password, role)
    {
        try
        {
            const response = await fetch(`${BASE_URL}signup`,
                {
                    method: 'POST',
                    headers: 
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({name, email, password, role})
                }
            );

            if(!response.ok)
            {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch(error)
        {
            console.error('Error during signup: ', error);
            return {success: false};
        }
    }

    //and now for my part with the event listeners:

    signInForm.addEventListener("submit", async (event) => {

        event.preventDefault();
        //just for preventing the form from refreshing the page

        const email = signInForm.querySelector('input[type="email"]').value.trim();
        const password = signInForm.querySelector('input[type="password"]').value.trim();
        //messy ahh syntax

        const result = await handleLogin(email, password); 
        console.log("Login result:", result);

        if(result.success) 
        {
            console.log("Log in successful", result);
            alert("Login successful! Welcome back, " + result.name);

            localStorage.setItem("userName", result.name);

            window.location.href = "../pages/index.html";
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

        const name = signUpForm.querySelector('input[name="name"]').value.trim();
        const email = signUpForm.querySelector('input[type="email"]').value.trim();
        const password = signUpForm.querySelector('input[type="password"]').value.trim();
        const role = "worker";
        
        //I will leave it like this for now as the default role
        //we need to figure out if employees can sign up as team leads or they need to be
        //promoted

        //this will get replaced after Kinlo does his part:

        const result = await handleSignup(name, email, password, role);

        if(result.success)
        {
            console.log("Sing up successful", result);
            alert("Sign up successful! Welcome, " + name);

            window.location.href = "../pages/index.html";

            container.classList.remove("active");
        }
        else
        {
            console.log("Sign up failed");
            alert("Sign up failed. Please try again with different credentials.");
        }
    });
        
});