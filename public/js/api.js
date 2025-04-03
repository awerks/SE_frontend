// api.js
import config from "./config.js";

// Mock user database for demonstration
const mockUsers = [];
// Make mockUsers accessible for testing
window.mockUsers = mockUsers;

async function loginUser(body) {
  try {
    const response = await fetch(`${config.backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const resData = await response.json();

    console.log("Response data:", resData);
    if (resData && typeof resData === "object") {
      alert("Login successful!\n" + JSON.stringify(resData));
      window.location.href = "./index.html";
      return { username: resData.username, role: resData.role };
    } else {
      alert("Response: " + resData);
    }
  } catch (error) {
    alert("Error:", error);
  }
}

// // Mock function to validate email format
// function isValidEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// // Mock function to check if username is available
// function isUsernameAvailable(username) {
//   return !mockUsers.some((user) => user.username === username);
// }

// Mock function to simulate server-side signup
async function signupUser(data) {
  try {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (
      !data.firstName ||
      !data.lastName ||
      !data.username ||
      !data.password ||
      !data.email ||
      !data.role ||
      !data.firstName ||
      !data.lastName ||
      !data.birthdate
    ) {
      throw new Error("All fields are required");
    }

    // Create mock user
    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthdate: data.birthdate,
      username: data.username,
      password: data.password,
      role: data.role,
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Return success response
    return {
      success: true,
      message: "Registration successful",
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username,
        birthdate: newUser.birthdate,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export { loginUser, signupUser };
