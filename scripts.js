let players = [
  { name: "Alice", team: 1, average: 150, handicap: 0 },
  { name: "Bob", team: 1, average: 130, handicap: 0 },
  { name: "Charlie", team: 2, average: 140, handicap: 0 },
  { name: "Daisy", team: 2, average: 120, handicap: 0 }
];

const handicapBase = 200;

function calculateHandicap(player) {
  player.handicap = handicapBase - player.average;
}

function displayTeams() {
  const team1 = document.getElementById('team1');
  const team2 = document.getElementById('team2');

  team1.innerHTML = '';
  team2.innerHTML = '';

  players.forEach(player => {
    calculateHandicap(player);
    const li = document.createElement('li');
    li.textContent = `${player.name} - Average: ${player.average}, Handicap: ${player.handicap}`;
    if (player.team === 1) {
      team1.appendChild(li);
    } else {
      team2.appendChild(li);
    }
  });
}

function addPlayer() {
  const name = prompt('Enter player name:');
  const average = parseInt(prompt('Enter player average score:'), 10);
  const team = parseInt(prompt('Enter team number (1 or 2):'), 10);

  players.push({ name, team, average, handicap: 0 });
  displayTeams();
}

window.onload = displayTeams;

