document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const container = document.querySelector('.container');
  let attempts = 0;
  let score = 0;
  let pairsFound = 0;
  const totalPairs = 15;
  let startTime = Date.now();
  let selectedCards = [];
  let lockBoard = false;

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (container) {
    startGame();
  }

  function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(registerForm);
    fetch('/register', {
      method: 'POST',
      body: formData
    }).then(() => {
      window.location.href = '/game';
    });
  }

  function startGame() {
    const cards = document.querySelectorAll('.card');
    const intervalId = setInterval(() => {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('time').textContent = `Contador de segundos: ${timeElapsed}`;
    }, 1000);

    cards.forEach(card => {
      card.addEventListener('click', () => handleCardClick(card, intervalId));
    });
  }

  function handleCardClick(card, intervalId) {
    if (lockBoard) return;
    const img = card.querySelector('.card-img');
    const imgSrc = img.getAttribute('data-image');

    if (img.getAttribute('src') === 'img/images.jpg' && selectedCards.length < 2) {
      img.setAttribute('src', imgSrc);
      img.setAttribute('data-status', 'destapada');
      selectedCards.push(card);
      console.log('Card selected:', imgSrc);
    }

    if (selectedCards.length === 2) {
      lockBoard = true;
      setTimeout(() => {
        checkForMatch(selectedCards, intervalId);
        selectedCards.length = 0;
        lockBoard = false;
      }, 2000);
    }
  }

  function checkForMatch(cards, intervalId) {
    const img1 = cards[0].querySelector('.card-img').getAttribute('data-image');
    const img2 = cards[1].querySelector('.card-img').getAttribute('data-image');

    console.log('Comparing cards:', img1, img2);

    if (img1 === img2) {
      cards.forEach(card => card.querySelector('.card-img').setAttribute('data-status', 'destapada'));
      pairsFound++;
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      score += timeElapsed + attempts;
      console.log('Match found. Score:', score, 'Pairs found:', pairsFound);
      if (pairsFound === totalPairs) {
        endGame(score, intervalId);
      }
    } else {
      console.log('No match. Resetting cards.');
      cards.forEach(card => {
        card.querySelector('.card-img').setAttribute('src', 'img/images.jpg');
        card.querySelector('.card-img').setAttribute('data-status', 'tapada');
      });
    }
    attempts++;
    const attemptsElement = document.getElementById('attempts')
    if (attemptsElement){
      attemptsElement.textContent = `Intento número ${attempts}`;
    }
  }

  function endGame(score, intervalId) {
    clearInterval(intervalId);
    alert(`¡Felicidades! Terminaste el juego con un puntaje de ${score}`);

    fetch('/save-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jugador, score })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al guardar los datos del jugador');
      }
      return response.text();
    })
    .then(() => {
      window.location.href = '/top-score';
    })
    .catch(error => {
      console.error('Error', error);
      alert('Hubo un problema al guardar el juego. Intenta nuevamente');
    });
  }
});