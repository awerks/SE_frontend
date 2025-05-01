// api.js
import config from "./config.js";
import { saveUserInfo } from "./utils.js";

// Mock user database for demonstration
const mockUsers = [];
// Make mockUsers accessible for testing
window.mockUsers = mockUsers;

//the helper to generate unique user IDs (mocked for now)
function generateId()
{
  return crypto.randomUUID();
}

// returns user data 
//made it so only it fetches and returns and the redirection is done by the handleSignIn in auth.js
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

    //waiting for the JSON payload
    const resData = await response.json();
    console.log("Response data (for testing):", resData);

    if (resData && typeof resData === "object") { //remove resData.success to redirect for testing

      alert("Login successful!\n" + JSON.stringify(resData));

      window.location.href = "./index.html"; //redirecting

      return { userId: resData.userId, username: resData.username, role: resData.role };
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
      userId: generateId(),
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
        userId: newUser.userId,
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
