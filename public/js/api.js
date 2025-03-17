// api.js
import config from "./config.js";

// Mock user database for demonstration
const mockUsers = [];
// Make mockUsers accessible for testing
window.mockUsers = mockUsers;

async function loginUser(data, username) {
  try {
    const response = await fetch(`${config.backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();

    console.log("Response data:", resData);
    if (resData && typeof resData === "object" && resData.token) {
      alert(`Token: ${resData.token}\nExpiration: ${resData.expiresIn}s`);
      localStorage.setItem("username", username);
      window.location.href = "./index.html";
    } else {
      alert("Response: " + resData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Mock function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Mock function to check if username is available
function isUsernameAvailable(username) {
  return !mockUsers.some((user) => user.username === username);
}

// Mock function to simulate server-side signup
async function signupUser(data) {
  try {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!data.username || !data.password || !data.email || !data.role) {
      throw new Error("All fields are required");
    }

    if (!isValidEmail(data.email)) {
      throw new Error("Invalid email format");
    }

    if (!isUsernameAvailable(data.username)) {
      throw new Error("Username already exists");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create mock user
    const newUser = {
      id: mockUsers.length + 1,
      username: data.username,
      email: data.email,
      role: data.role,
      createdAt: new Date().toISOString(),
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Return success response
    return {
      success: true,
      message: "Registration successful",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export { loginUser, signupUser };

// Add functions to handle registration
