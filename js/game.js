document.addEventListener("DOMContentLoaded", function () {
    const accessToken = localStorage.getItem("accessToken");

    // Game Elements
    const clueElement = document.getElementById("clue");
    const choicesContainer = document.getElementById("choices");
    const resultElement = document.getElementById("result");
    const timerElement = document.getElementById("time-left");
    const scoreElement = document.getElementById("score-count");
    const nextButton = document.getElementById("next-question");
    const endGameButton = document.getElementById("end-game");
    const gameOverContainer = document.getElementById("game-over");
    const playAgainButton = document.getElementById("play-again");
    const inviteFriendButton = document.getElementById("invite-friend");

    let timer;
    let timeLeft = 60;
    let score = { correct: 0, incorrect: 0 };

    function startGame() {
        fetch("http://127.0.0.1:8002/game/start/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                displayQuestion(data);
                startTimer();
            } else {
                alert("Failed to start the game: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }

    function displayQuestion(data) {
        clueElement.innerText = data.clues[0];  // Display the first clue
        choicesContainer.innerHTML = "";  // Clear previous choices
        resultElement.innerText = "";  

        data.choices.forEach(choice => {
            const button = document.createElement("button");
            button.innerText = choice;
            button.classList.add("btn", "btn-outline-primary", "m-2");
            button.addEventListener("click", () => submitGuess(choice));
            choicesContainer.appendChild(button);
        });

        nextButton.classList.add("d-none");  // Hide next button until user answers
    }

    function submitGuess(userGuess) {
        fetch("http://127.0.0.1:8002/game/guess/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "guess": userGuess })
        })
        .then(response => response.json())
        .then(data => {
            resultElement.innerHTML = `${data.message} <br> Fun Fact: ${data.fun_fact}`;
            score = data.updated_score;
            scoreElement.innerText = score.correct - score.incorrect;  // Update Score

            nextButton.classList.remove("d-none");  // Show Next button
        })
        .catch(error => console.error("Error:", error));
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = 60;  
        timerElement.innerText = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            timerElement.innerText = timeLeft;
            if (timeLeft === 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        fetch("http://127.0.0.1:8002/game/end/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            alert("Game Over! Your final score: " + score.correct + " correct, " + score.incorrect + " incorrect.");
            showGameOverScreen();
        })
        .catch(error => console.error("Error:", error));
    }

    function resetGame() {
        fetch("http://127.0.0.1:8002/game/reset/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(() => {
            score = { correct: 0, incorrect: 0 };
            scoreElement.innerText = "0";
            gameOverContainer.classList.add("d-none");
            startGame();
        })
        .catch(error => console.error("Error:", error));
    }

    function showGameOverScreen() {
        document.getElementById("game-container").classList.add("d-none");
        gameOverContainer.classList.remove("d-none");
    }

    function inviteFriend() {
        alert("Invite a friend by sharing this link: " + window.location.href);
    }

    // Button Listeners
    nextButton.addEventListener("click", startGame);
    endGameButton.addEventListener("click", endGame);
    playAgainButton.addEventListener("click", resetGame);
    inviteFriendButton.addEventListener("click", inviteFriend);

    startGame();  // Auto-start game on page load
});
