document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const container = document.querySelector('.container');
  const scoreboard = document.querySelector('.scoreboard');

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      fetch('/register', {
        method: 'POST',
        body: formData
      }).then(() => {
        window.location.href = '/game';
      });
    });
  }

  if (container) {
    startGame();
  }

  function startGame() {
    const cards = document.querySelectorAll('.card');
    let selectedCards = [];
    let lockBoard = false;
    let attempts = 0;
    let score = 0;
    let pairsFound = 0;
    const totalPairs = cards.length / 2;
    let startTime = Date.now();

    function checkForMatch(cards) {
      const img1 = cards[0].querySelector('.card-img').getAttribute('data-image');
      const img2 = cards[1].querySelector('.card-img').getAttribute('data-image');

      if (img1 === img2) {
        cards.forEach(card => card.querySelector('.card-img').setAttribute('data-status', 'destapada'));
        score += Date.now() - startTime + attempts;
        pairsFound++;
        if (pairsFound === totalPairs) {
          endGame();
        }
      } else {
        cards.forEach(card => card.querySelector('.card-img').setAttribute('src', 'img/images.jpg'));
      }
      attempts++;
      document.getElementById('attempts').textContent = `Intento Número ${attempts}`;
    }

    const intervalId = setInterval(() => {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('time').textContent = `Contador de segundos: ${timeElapsed}`;
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
        body: JSON.stringify({ score })
      }).then(() => {
        window.location.href = '/top-score';
      });
    }
  }
});
