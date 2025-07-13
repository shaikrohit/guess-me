// Quiz questions
const questions = [
    {
        question: "When was Rohit born?",
        options: ["July", "March", "December", "October"],
        answer: 0
    },
    {
        question: "Which is Rohit's favorite language?",
        options: ["JavaScript", "Python", "C++", "Java"],
        answer: 1
    },
    {
        question: "Which project did Rohit enjoy the most?",
        options: ["Guess Me", "SweetSpot", "PID Controller", "VoiceInk"],
        answer: 0
    },
    {
        question: "Where is Rohit from?",
        options: ["Delhi", "Hyderabad", "Chennai", "Mumbai"],
        answer: 1
    },
    {
        question: "Rohit's favorite hobby?",
        options: ["Cricket", "Reading", "Gaming", "Coding"],
        answer: 3
    }
];

// DOM elements
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const scoreMessage = document.getElementById('score-message');
const submitButton = document.getElementById('submit-score');
const submissionMessage = document.getElementById('submission-message');

// Quiz state
let currentQuestion = 0;
let score = 0;
let selectedOption = null;

// Initialize the quiz
function initQuiz() {
    showQuestion();
}

// Display the current question
function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    const question = questions[currentQuestion];
    let optionsHtml = '';

    question.options.forEach((option, index) => {
        optionsHtml += `
            <div class="option" data-index="${index}">
                ${option}
            </div>
        `;
    });

    quizContainer.innerHTML = `
        <div class="question">${question.question}</div>
        <div class="options">${optionsHtml}</div>
    `;

    // Add event listeners to options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', selectOption);
    });
}

// Handle option selection
function selectOption(e) {
    // Remove selected class from all options
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });

    // Add selected class to clicked option
    const selectedOptionElement = e.target;
    selectedOptionElement.classList.add('selected');
    selectedOption = parseInt(selectedOptionElement.dataset.index);

    // Move to next question after a short delay
    setTimeout(() => {
        checkAnswer();
        currentQuestion++;
        showQuestion();
    }, 500);
}

// Check if the selected answer is correct
function checkAnswer() {
    if (selectedOption === questions[currentQuestion].answer) {
        score++;
    }
}

// Show the quiz result
function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.textContent = score;

    // Custom message based on score
    if (score === 5) {
        scoreMessage.textContent = "Perfect! You know Rohit extremely well! 🎉";
    } else if (score >= 3) {
        scoreMessage.textContent = "Good job! You know Rohit pretty well! 👍";
    } else {
        scoreMessage.textContent = "Nice try! You'll know Rohit better next time! 😊";
    }
}

// Submit score to GitHub
submitButton.addEventListener('click', async () => {
    const username = document.getElementById('github-username').value.trim();
    
    if (!username) {
        submissionMessage.textContent = "Please enter your GitHub username";
        submissionMessage.className = "error";
        submissionMessage.classList.remove('hidden');
        return;
    }

    try {
        // IMPORTANT: In a real deployment, this token should not be hardcoded
        // For development, replace with your token or use environment variables
        // For GitHub Pages, consider using GitHub Actions or another secure method
        const token = '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'; // Replace with your token
        
        if (token === 'YOUR_GITHUB_TOKEN_HERE') {
            throw new Error("GitHub token not configured. Please set up your token.");
        }

        const response = await fetch('https://api.github.com/repos/shaikrohit/guess-me/issues', {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `${username} - ${score}`,
                body: `User ${username} scored ${score}/5 on the "How Well Do You Know Rohit?" quiz.`
            })
        });

        if (!response.ok) {
            throw new Error('Failed to submit score');
        }

        submissionMessage.textContent = "Score submitted successfully! Redirecting to leaderboard...";
        submissionMessage.className = "success";
        submissionMessage.classList.remove('hidden');

        // Redirect to leaderboard after a short delay
        setTimeout(() => {
            window.location.href = 'leaderboard.html';
        }, 2000);

    } catch (error) {
        console.error('Error submitting score:', error);
        submissionMessage.textContent = `Error: ${error.message}`;
        submissionMessage.className = "error";
        submissionMessage.classList.remove('hidden');
    }
});

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz);