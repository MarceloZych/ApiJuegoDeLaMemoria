document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const container = document.querySelector('.container');
  const scoreboard = document.querySelector('.scoreboard');

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new formData(registerForm);
    fetch('/', {
      method: 'POST',
      body: formData
    }).then(() => {
      registerForm.classList.add('hidden');
      container.classList.remove('hidden');
      scoreboard.classList.remove('hidden');
      startGame();
    })
  })

  const cards = document.querySelectorAll('.card');
  let selectedCards = [];
  let lockBoard = false;
  let attemps = 0;
  let score = 0;
  let pairsFound = 0;
  const totalPairs = cards.length / 2;
  let startTime = Date.now();

  function checkForMatch(cards) {
    const img1 = cards[0].querySelector('.card-img').getAttribute('data-image');
    const img2 = cards[1].querySelector('.card-img').getAttribute('data-image');

    if (img1 === img2) {
      cards.forEach(card => card.querySelector('.card-img').setAttribute('data-status', 'destapada'));
      score += Date.now() - startTime + attemps;
      pairsFound++;
      if (pairsFound === totalPairs) {
        endGame();
      }
    } else {
      cards.forEach(card => card.querySelector('.card-img').setAttribute('src', 'img/images.jpg'));
    }
    attemps++;
    document.getElementById('attemps').textContent = `Intento Número ${attemps}`
  }

  function startGame() {
    const intervalId = setInterval(() => {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('time').textContent = `Contador de segundos ${timeElapsed}`
    }, 1000);

    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (lockBoard) return;

        const img = card.querySelector('.card-img');
        const imgSrc = img.getAttribute('data-image');

        if (img.getAttribute('src') === 'img/images.jpg') {
          img.setAttribute('src', imgSrc);
          selectedCards.push(card);
        }

        if (selectedCards.length === 2) {
          lockBoard = true;
          setTimeout(() => {
            checkForMatch(selectedCards);
            selectedCards = [];
            lockBoard = false;
          }, 1000);
        }
      });
    });
    function endGame() {
      clearInterval(intervalId);
      alert(`¡Felicidades! Terminaste el juego con un puntaje de ${score}.`);

      fetch('/save-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jugador, score })
      }).then(() => {
        window.location.href = '/top-score';
      })
    }
  }
});
/**
 * 
function endGame() {
clearInterval(intervalId);
alert(`¡Felicidades! Termiaste el juego con un puntaje de ${score}`)

fetch('/save-game', {
method: 'POST',
headers: {
  'Content-Type': 'application/json'
},
body: JSON.stringify({ jugador, score })
}).then(() => {

})
}
 */