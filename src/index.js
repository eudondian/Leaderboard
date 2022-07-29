import './styles/style.css';

const submit = document.querySelector('.submit');
const refresh = document.querySelector('.refresh');
const sendScores = document.querySelector('.score-record');
const name = document.getElementById('name');
const score = document.getElementById('score');

class Scores {
  static scoreList = [];

  constructor(user, score) {
    this.user = user;
    this.score = score;
  }
}

let uniqueIdentifier = '';
const gamer = async () => {
  await fetch(
    'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'my cool new game',
      }),
    },
  ).then((res) => res.json().then((data) => {
    uniqueIdentifier = data.result;
  }));
};
gamer();

submit.addEventListener('click', async () => {
  const newScore = new Scores(name.value, score.value);
  await fetch(
    `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${uniqueIdentifier}/scores/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newScore),
    },
  ).then((res) => res.json().then((data) => data.result));
  name.value = '';
  score.value = '';
});

refresh.addEventListener('click', async () => {
  await fetch(
    `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${uniqueIdentifier}/scores/`,
  ).then((res) => res.json().then((data) => {
    sendScores.innerHTML = '';
    let html = '';
    data.result.forEach((score) => {
      html += `<li>${score.user}: ${score.score}</li>`;
    });
    sendScores.innerHTML = html;
  }));
});

window.addEventListener('DOMContentLoaded', async () => {
  const fetchScore = await fetch(
    `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${uniqueIdentifier}/scores/`,
  );
  const fetchedScore = await fetchScore.json();
  return fetchedScore;
});
