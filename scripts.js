let players = [
  { name: "Alice", team: 1, scores: [], average: 0, handicap: 0 },
  { name: "Bob", team: 1, scores: [], average: 0, handicap: 0 },
  { name: "Eve", team: 1, scores: [], average: 0, handicap: 0 },
  { name: "Frank", team: 1, scores: [], average: 0, handicap: 0 },
  { name: "Grace", team: 1, scores: [], average: 0, handicap: 0 },
  { name: "Charlie", team: 2, scores: [], average: 0, handicap: 0 },
  { name: "Daisy", team: 2, scores: [], average: 0, handicap: 0 },
  { name: "Heidi", team: 2, scores: [], average: 0, handicap: 0 },
  { name: "Ivan", team: 2, scores: [], average: 0, handicap: 0 },
  { name: "Judy", team: 2, scores: [], average: 0, handicap: 0 }
];

const handicapBase = 220;
const handicapPercentage = 0.85;
const maxHandicap = 90;

function calculateAverage(player) {
  const totalScore = player.scores.reduce((sum, score) => sum + score, 0);
  player.average = totalScore / player.scores.length;
}

function calculateHandicap(player) {
  let calculatedHandicap = Math.round(handicapPercentage * (handicapBase - player.average));
  player.handicap = Math.min(calculatedHandicap, maxHandicap);
}

function displayTeams() {
  const team1 = document.getElementById('team1');
  const team2 = document.getElementById('team2');

  team1.innerHTML = '';
  team2.innerHTML = '';

  players.forEach(player => {
    calculateAverage(player);
    calculateHandicap(player);
    const li = document.createElement('li');
    li.textContent = `${player.name} - Average: ${player.average.toFixed(2)}, Handicap: ${player.handicap}, Scores: ${player.scores.join(', ')}`;
    if (player.team === 1) {
      team1.appendChild(li);
    } else {
      team2.appendChild(li);
    }
  });

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
  const average = parseInt(prompt('Enter player average score:'), 10);
  const team = parseInt(prompt('Enter team number (1 or 2):'), 10);

  if ((team === 1 && players.filter(player => player.team === 1).length < 5) || (team === 2 && players.filter(player => player.team === 2).length < 5)) {
    players.push({ name, team, scores: [], average, handicap: 0 });
    displayTeams();
  } else {
    alert(`Team ${team} is already full.`);
  }
}

function addScore() {
  const playerName = prompt('Enter player name:');
  const score = parseInt(prompt('Enter score for this week:'), 10);

  const player = players.find(p => p.name === playerName);
  if (player && player.scores.length < 13) {
    player.scores.push(score);
    displayTeams();
  } else if (player) {
    alert(`${playerName} has already entered scores for all 13 weeks.`);
  } else {
    alert(`${playerName} not found.`);
  }
}

window.onload = displayTeams;


