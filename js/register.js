document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");

    // Validate password match
    if (password !== confirmPassword) {
        passwordError.classList.remove("d-none");
        return;
    } else {
        passwordError.classList.add("d-none");
    }

    // User data object
    const userData = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
        confirm_password: confirmPassword
    };

    // Send request to the registration API
    fetch("http://127.0.0.1:8002/player/auth/registration/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) { 
            // Assuming the response is similar to login and contains an access token
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("username", username);
            alert("Registration Successful! Redirecting to dashboard...");
            window.location.href = "dashboard.html"; // Redirect after successful registration
        } else {
            alert(data.message || "Registration failed! Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    });
});
