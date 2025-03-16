// api.js
import config from "./config.js";
async function loginUser(data, username) {
    try {
        const response = await fetch(`${config.backendUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const resData = await response.json();

        console.log("Response data:", resData);
        if (resData && typeof resData === "object" && resData.token) {
            alert(`Token: ${resData.token}\nExpiration: ${resData.expiresIn}s`);
            localStorage.setItem("username", username);
            window.location.href = "../pages/index.html";
        } else {
            alert("Response: " + resData);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export { loginUser };

// Add functions to handle registration