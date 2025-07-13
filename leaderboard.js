// DOM elements
const leaderboardBody = document.getElementById('leaderboard-body');

// Fetch and display leaderboard
async function fetchLeaderboard() {
    try {
        const response = await fetch('https://api.github.com/repos/shaikrohit/guess-me/issues');
        
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }

        const issues = await response.json();
        const scores = [];

        // Parse issues to extract scores
        issues.forEach(issue => {
            const match = issue.title.match(/(.+)\s-\s(\d+)/);
            if (match) {
                scores.push({
                    username: match[1].trim(),
                    score: parseInt(match[2]),
                    date: new Date(issue.created_at)
                });
            }
        });

        // Sort by score (descending) and then by date (ascending for tie-breaker)
        scores.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.date - b.date;
        });

        // Display leaderboard
        displayLeaderboard(scores);

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; color: red;">
                    Failed to load leaderboard. Please try again later.
                </td>
            </tr>
        `;
    }
}

// Display leaderboard data
function displayLeaderboard(scores) {
    leaderboardBody.innerHTML = '';

    if (scores.length === 0) {
        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center;">
                    No scores yet. Be the first to take the quiz!
                </td>
            </tr>
        `;
        return;
    }

    scores.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Highlight the first place
        if (index === 0) {
            row.classList.add('first-place');
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="https://github.com/${entry.username}" target="_blank">${entry.username}</a></td>
            <td>${entry.score}/5</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
}

// Initialize leaderboard when the page loads
document.addEventListener('DOMContentLoaded', fetchLeaderboard);