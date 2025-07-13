// Quiz Configuration
const QUESTIONS = [
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

// DOM Elements
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const scoreMessage = document.getElementById('score-message');
const submitButton = document.getElementById('submit-score');
const submissionMessage = document.getElementById('submission-message');

// Quiz State
let currentQuestion = 0;
let score = 0;
let selectedOption = null;

// Initialize the quiz
function initQuiz() {
    showQuestion();
}

// Display the current question
function showQuestion() {
    if (currentQuestion >= QUESTIONS.length) {
        showResult();
        return;
    }

    const question = QUESTIONS[currentQuestion];
    quizContainer.innerHTML = `
        <div class="question">${question.question}</div>
        <div class="options">
            ${question.options.map((option, index) => `
                <div class="option" data-index="${index}">${option}</div>
            `).join('')}
        </div>
    `;

    // Add event listeners to options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', selectOption);
    });
}

// Handle option selection
function selectOption(e) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    e.target.classList.add('selected');
    selectedOption = parseInt(e.target.dataset.index);

    setTimeout(() => {
        checkAnswer();
        currentQuestion++;
        showQuestion();
    }, 500);
}

// Check if the selected answer is correct
function checkAnswer() {
    if (selectedOption === QUESTIONS[currentQuestion].answer) {
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

// Validate GitHub username
function isValidGitHubUsername(username) {
    return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username);
}

// Submit score to GitHub
submitButton.addEventListener('click', async () => {
    const username = document.getElementById('github-username').value.trim();
    
    if (!username) {
        showSubmissionError("Please enter your GitHub username");
        return;
    }

    if (!isValidGitHubUsername(username)) {
        showSubmissionError("Please enter a valid GitHub username");
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Using GitHub Actions workflow instead of direct API call
        const response = await submitScoreViaActions(username, score);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to submit score');
        }

        showSubmissionSuccess("Score submitted successfully! Redirecting to leaderboard...");
        setTimeout(() => {
            window.location.href = 'leaderboard.html';
        }, 2000);

    } catch (error) {
        console.error('Error submitting score:', error);
        showSubmissionError(`Error: ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Score';
    }
});

// Submit via GitHub Actions workflow
async function submitScoreViaActions(username, score) {
    return fetch(`https://api.github.com/repos/shaikrohit/guess-me/dispatches`, {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_type: 'submit_score',
            client_payload: {
                username: username,
                score: score
            }
        })
    });
}

// Helper functions for submission messages
function showSubmissionError(message) {
    submissionMessage.textContent = message;
    submissionMessage.className = "error";
    submissionMessage.classList.remove('hidden');
}

function showSubmissionSuccess(message) {
    submissionMessage.textContent = message;
    submissionMessage.className = "success";
    submissionMessage.classList.remove('hidden');
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz);
