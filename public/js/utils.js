// utils.js

// Save only the specific fields you care about, under your own key-namespace
export function saveUserInfo(user) {
    if (!user || !user.userId === undefined) 
    {
        console.warn("No valid user ID provided to saveUserInfo", user); //for testing
        return;
    }

    localStorage.setItem("userId",   user.userId);
    localStorage.setItem("username", user.username);
    localStorage.setItem("role",     user.role);

    //my debug log for testing and checking confirmation
    console.log("User info saved:", {
            userId:user.userId,
            username: user.username,
            role:user.role
        });
  }
  
  // exporting so I can import them in api.js, auth.js, etc
  export function getUserId() {
    return localStorage.getItem("userId");
  }
  
  export function clearUserInfo() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }
  