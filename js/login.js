const API_BASE_URL = "http://127.0.0.1:8002/player/auth";  

// Function to check if user is already logged in
function checkLoginStatus() {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        window.location.href = "dashboard.html";  // Redirect to home if already logged in
    }
}

document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    const loginForm = document.getElementById("loginForm");
    const passwordField = document.getElementById("passwordField");
    let askPassword = false;  // Track if password is needed

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        let requestData = { "username_or_email": username };
        if (askPassword) requestData["password"] = password;  // Include password if needed

        try {
            const response = await fetch(`${API_BASE_URL}/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (data.status) {
                // Login successful, save tokens and redirect
                localStorage.setItem("accessToken", data.tokens.access);
                localStorage.setItem("refreshToken", data.tokens.refresh);
                window.location.href = "dashboard.html";  
            } else {
                // If the first attempt fails, show the password field without an error
                if (!askPassword) {
                    askPassword = true;
                    passwordField.classList.remove("d-none");
                    loginForm.querySelector("button").textContent = "Login";
                } else {
                    alert("Incorrect credentials. Please try again.");
                }
            }
        } catch (error) {
            alert("Error logging in. Please try again.");
        }
    });
});
