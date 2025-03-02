document.addEventListener("DOMContentLoaded", function () {
    const accessToken = localStorage.getItem("accessToken");
    const userDropdown = document.getElementById("userDropdown");
    const loginButtonContainer = document.getElementById("loginButtonContainer");
    const startGameButton = document.getElementById("start-game");

    // Check login status and update UI
    if (accessToken) {
        userDropdown.classList.remove("d-none");  // Show user icon
        loginButtonContainer.classList.add("d-none");  // Hide login button
    } else {
        userDropdown.classList.add("d-none");  // Hide user icon
        loginButtonContainer.classList.remove("d-none");  // Show login button
    }

    // Start Game: Redirect to game.html
    if (startGameButton) {
        startGameButton.addEventListener("click", function () {
            if (!accessToken) {
                alert("You must be logged in to start the game.");
                window.location.href = "login.html";
                return;
            }
            localStorage.setItem("gameStarted", "true");
            window.location.href = "game.html";
        });
    }
    
    startGameButton.addEventListener("click", function () {
        if (!accessToken) {
            alert("You must be logged in to start the game.");
            window.location.href = "login.html";
            return;
        }

        // Store game start flag (optional)
        localStorage.setItem("gameStarted", "true");

        // Redirect to game page
        window.location.href = "game.html";
    });
});

// Logout function
function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "index.html"; // Redirect to home
}
