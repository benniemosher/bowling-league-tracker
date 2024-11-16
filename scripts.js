let players = [
  { name: "Alice", team: 1, bookAverage: 150, scores: [], average: 150, handicap: 0 },
  { name: "Bob", team: 1, bookAverage: 130, scores: [], average: 130, handicap: 0 },
  { name: "Eve", team: 1, bookAverage: 145, scores: [], average: 145, handicap: 0 },
  { name: "Frank", team: 1, bookAverage: 155, scores: [], average: 155, handicap: 0 },
  { name: "Grace", team: 1, bookAverage: 140, scores: [], average: 140, handicap: 0 },
  { name: "Charlie", team: 2, bookAverage: 140, scores: [], average: 140, handicap: 0 },
  { name: "Daisy", team: 2, bookAverage: 120, scores: [], average: 120, handicap: 0 },
  { name: "Heidi", team: 2, bookAverage: 135, scores: [], average: 135, handicap: 0 },
  { name: "Ivan", team: 2, bookAverage: 125, scores: [], average: 125, handicap: 0 },
  { name: "Judy", team: 2, bookAverage: 150, scores: [], average: 150, handicap: 0 }
];

const handicapBase = 220;
const handicapPercentage = 0.85;
const maxHandicap = 90;

function calculateAverage(player) {
  if (player.scores.length === 0) {
    player.average = player.bookAverage;
  } else {
    const totalScore = player.scores.reduce((sum, score) => sum + score, 0);
    player.average = totalScore / player.scores.length;
  }
}

function calculateHandicap(player) {
  let calculatedHandicap = Math.round(handicapPercentage * (handicapBase - player.average));
  player.handicap = Math.min(calculatedHandicap, maxHandicap);
}

function createTable(team) {
  const table = document.createElement('table');
  const header = table.insertRow();
  header.innerHTML = `<th>Player</th>${Array.from({ length: 13 }, (_, i) => `<th>Week ${i + 1}</th>`).join('')}<th>Average</th><th>Handicap</th>`;

  players.filter(player => player.team === team).forEach(player => {
    calculateAverage(player);
    calculateHandicap(player);

    const row = table.insertRow();
    row.innerHTML = `<td>${player.name}</td>${Array.from({ length: 13 }, (_, i) => `<td>${player.scores[i] || ''}</td>`).join('')}<td>${player.average.toFixed(2)}</td><td>${player.handicap}</td>`;
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
    players.push({ name, team, bookAverage, scores: [], average: bookAverage, handicap: 0 });
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

