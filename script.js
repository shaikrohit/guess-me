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
const usernameInput = document.getElementById('github-username');

// Quiz State
let currentQuestion = 0;
let score = 0;

// Initialize quiz
document.addEventListener('DOMContentLoaded', () => {
    showQuestion();
    
    // Enable Enter key submission
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitScore();
        }
    });
    
    submitButton.addEventListener('click', submitScore);
});

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

    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            e.target.classList.add('selected');
            setTimeout(() => {
                if (parseInt(e.target.dataset.index) === question.answer) {
                    score++;
                }
                currentQuestion++;
                showQuestion();
            }, 300);
        });
    });
}

function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.textContent = score;
    
    if (score === 5) {
        scoreMessage.textContent = "Perfect! You know Rohit extremely well! 🎉";
    } else if (score >= 3) {
        scoreMessage.textContent = "Good job! You know Rohit pretty well! 👍";
    } else {
        scoreMessage.textContent = "Nice try! You'll know Rohit better next time! 😊";
    }
}

async function submitScore() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        showMessage("Please enter your GitHub username", "error");
        return;
    }

    if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)) {
        showMessage("Invalid GitHub username format", "error");
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        const response = await triggerScoreSubmission(username, score);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Submission failed');
        }

        showMessage("Score submitted! Redirecting...", "success");
        setTimeout(() => window.location.href = 'leaderboard.html', 1500);
        
    } catch (error) {
        console.error('Submission error:', error);
        showMessage(`Error: ${error.message}`, "error");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Score';
    }
}

async function triggerScoreSubmission(username, score) {
    try {
        const response = await fetch(`https://api.github.com/repos/shaikrohit/guess-me/issues`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `${username} - ${score}`,
                body: `Quiz score submission from ${username}`
            })
        });
        
        if (!response.ok) throw new Error(await response.text());
        return response;
    } catch (error) {
        console.error('Submission failed:', error);
        throw new Error('Failed to save score. Please try later.');
    }
}
function showMessage(text, type) {
    submissionMessage.textContent = text;
    submissionMessage.className = type;
    submissionMessage.classList.remove('hidden');
    setTimeout(() => submissionMessage.classList.add('hidden'), 3000);
}
