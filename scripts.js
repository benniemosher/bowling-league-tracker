let players = [
  { name: "Savannah", team: 1, bookAverage: 126, scores: [], average: 126, handicap: 0, points: 0 },
  { name: "Zaac", team: 1, bookAverage: 184, scores: [], average: 184, handicap: 0, points: 0 },
  { name: "Lillie", team: 1, bookAverage: 75, scores: [], average: 75, handicap: 0, points: 0 },
  { name: "Kaylee", team: 1, bookAverage: 52, scores: [], average: 52, handicap: 0, points: 0 },
  { name: "Dylan", team: 1, bookAverage: 146, scores: [], average: 146, handicap: 0, points: 0 },
  { name: "Chris", team: 2, bookAverage: 162, scores: [], average: 162, handicap: 0, points: 0 },
  { name: "Lindsey", team: 2, bookAverage: 93, scores: [], average: 93, handicap: 0, points: 0 },
  { name: "Chase", team: 2, bookAverage: 108, scores: [], average: 108, handicap: 0, points: 0 },
  { name: "Anton", team: 2, bookAverage: 121, scores: [], average: 121, handicap: 0, points: 0 },
  { name: "Dale", team: 2, bookAverage: 148, scores: [], average: 148, handicap: 0, points: 0 }
];

const handicapBase = 220;
const handicapPercentage = 0.85;
const maxHandicap = 90;

function calculateAverage(player) {
  let totalScore = player.bookAverage; // Start with the book average
  player.scores.forEach(score => totalScore += score);
  player.average = Math.floor(totalScore / (player.scores.length + 1));
}

function calculateHandicap(player) {
  let calculatedHandicap = Math.round(handicapPercentage * (handicapBase - player.average));
  player.handicap = Math.min(calculatedHandicap, maxHandicap);
}

function saveToLocalStorage() {
  localStorage.setItem('players', JSON.stringify(players));
}

function loadFromLocalStorage() {
  const storedPlayers = localStorage.getItem('players');
  if (storedPlayers) {
    players = JSON.parse(storedPlayers);
    players.forEach(player => {
      if (!player.points) player.points = 0; // Ensure points field exists
    });
  }
}

function updateScores() {
  // Clear previous points
  players.forEach(player => player.points = 0);

  players.forEach(player => {
    for (let i = 0; i < 10; i++) {
      const scoreInput = document.getElementById(`${player.name}-score${i}`);
      const orderInput = document.getElementById(`${player.name}-order${i}`);
      if (scoreInput && scoreInput.value) {
        player.scores[i] = parseInt(scoreInput.value, 10) || 0;
      }
      if (orderInput && orderInput.value) {
        player[`order${i}`] = parseInt(orderInput.value, 10) || 0;
      }
    }
    calculateAverage(player);
    calculateHandicap(player);
  });

  // Calculate Peterson points
  for (let i = 0; i < 10; i++) {
    let team1Scores = [];
    let team2Scores = [];

    players.forEach(player => {
      if (player.scores[i] !== undefined && player[`order${i}`] !== undefined) {
        const totalScore = player.scores[i] + player.handicap;
        if (player.team === 1) {
          team1Scores[player[`order${i}`] - 1] = totalScore;
        } else if (player.team === 2) {
          team2Scores[player[`order${i}`] - 1] = totalScore;
        }
      }
    });

    players.forEach(player => {
      if (player.scores[i] !== undefined && player[`order${i}`] !== undefined) {
        if (player.team === 1) {
          const opponentScore = team2Scores[player[`order${i}`] - 1];
          if (opponentScore !== undefined) {
            if (team1Scores[player[`order${i}`] - 1] > opponentScore) {
              player.points += 1;
            } else if (team1Scores[player[`order${i}`] - 1] < opponentScore) {
              player.points += 0;
            } else {
              player.points += 0.5;
            }
          }
        } else if (player.team === 2) {
          const opponentScore = team1Scores[player[`order${i}`] - 1];
          if (opponentScore !== undefined) {
            if (team2Scores[player[`order${i}`] - 1] > opponentScore) {
              player.points += 1;
            } else if (team2Scores[player[`order${i}`] - 1] < opponentScore) {
              player.points += 0;
            } else {
              player.points += 0.5;
            }
          }
        }
      }
    });
  }

  saveToLocalStorage(); // Save updated data to local storage
  displayTeams();
}

function createTable(team) {
  const table = document.createElement('table');
  const header = table.insertRow();
  const teamName = team === 1 ? 'UC Prep' : 'Mountain Vista';
  header.innerHTML = `<th>${teamName}</th>${Array.from({ length: 10 }, (_, i) => `<th>Week ${i + 1}</th>`).join('')}<th>Book Average</th><th>Average</th><th>Handicap</th><th>Points</th>`;

  players.filter(player => player.team === team).forEach(player => {
    calculateAverage(player);
    calculateHandicap(player);

    const row = table.insertRow();
    row.innerHTML = `<td>${player.name}</td>${Array.from({ length: 10 }, (_, i) => `
        <td>
            <div>
                <label for="${player.name}-score${i}">Score:</label>
                <input type="text" id="${player.name}-score${i}" value="${player.scores[i] || ''}" onblur="updateScores()" />
            </div>
            <div>
                <label for="${player.name}-order${i}">Order:</label>
                <input type="text" id="${player.name}-order${i}" value="${player[`order${i}`] || ''}" onblur="updateScores()" />
            </div>
        </td>`).join('')}
        <td>${player.bookAverage}</td><td>${player.average}</td><td>${player.handicap}</td><td>${player.points}</td>`;
  });

  return table;
}

function displayTeams() {
  const team1Container = document.getElementById('team1');
  const team2Container = document.getElementById('team2');

  team1Container.innerHTML = '';
  team2Container.innerHTML = '';

  team1Container.appendChild(createTable(1));
  team2Container.appendChild(createTable(2));

  // Check if Add Player button should be displayed
  const addButton = document.querySelector('button#addPlayer');
  if (players.filter(player => player.team === 1).length >= 5 && players.filter(player => player.team === 2).length >= 5) {
    addButton.style.display = 'none';
  } else {
    addButton.style.display = 'block';
  }
}

function addPlayer() {
  const name = prompt('Enter player name:');
  const bookAverage = parseInt(prompt('Enter player book average score:'), 10);
  const team = parseInt(prompt('Enter team number (1 or 2):'), 10);

  if ((team === 1 && players.filter(player => player.team === 1).length < 5) || (team === 2 && players.filter(player => player.team === 2).length < 5)) {
    players.push({ name, team, bookAverage, scores: [], average: bookAverage, handicap: 0, points: 0 });
    saveToLocalStorage(); // Save new player to local storage
    displayTeams();
  } else {
    alert(`Team ${team} is already full.`);
  }
}

window.onload = () => {
  loadFromLocalStorage(); // Load data from local storage when the page loads
  displayTeams();
};

