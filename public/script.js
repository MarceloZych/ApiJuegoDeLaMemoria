document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const container = document.querySelector('.container');

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister)
  }

  if (container) {
    startGame();
  }

  function handleRegister(event) {
    event.preventDefault()
    const formData = new FormData(registerForm)
    fetch('/register', {
      method: 'POST',
      body: formData
    }).then(() => {
      window.location.href = '/game'
    })
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

    const intervalId = setInterval(() => {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
      document.getElementById('time').textContent = `Contador de segundos: ${timeElapsed}`
    }, 1000)

    cards.forEach(card => {
      card.addEventListener('click', () => handleCardClick(card, 
        selectedCards, lockBoard, attempts, score, totalPairs, intervalId))
    })
  }

  function handleCardClick(card, selectedCards, lockBoard, attempts, score, totalPairs, intervalId) {
    if (lockBoard) return;

    const img = card.querySelector('.card-img')
    const imgSrc = img.getAttribute('data-image')

    if (img.getAttribute('src') === 'img/images.jpg') {
      img.setAttribute('src', imgSrc)
      selectedCards.push(card )
    }

    if (selectedCards.length === 2) {
      lockBoard = true
      setTimeout(() => {
        checkForMatch(selectedCards, score, totalPairs, intervalId)
        selectedCards.length = 0
        lockBoard = false
      }, 1000)
    }
  }

  function checkForMatch(cards, score, totalPairs, intervalId) {
    const img1 = cards[0].querySelector('.card-img').getAttribute('data-image')
    const img2 = cards[1].querySelector('.card-img').getAttribute('data-image')

    if (img1 === img2) {
      cards.forEach(card => card.querySelector('.card-img').setAttribute('data-status', 'destapada'))
      score += 10
      pairsFound++
      if (pairsFound === totalPairs) {
        endGame(score, intervalId)
      }
    } else {
      cards.forEach(card => card.querySelector('.card-img').setAttribute('src', 'img/image.jpg'))
    }
    attempts++
    document.getElementById('attemps').textContent = `Intento número ${attempts}`
  }

  function endGame(score, intervalId) {
    clearInterval(intervalId)
    alert(`¡Felicidades!  Terminaste el juego con un puntaje de ${score}`)

    fetch('/save-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jugador, score })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error l guardar los datos del jugador')
      }
      return response.text()
    })
    .then(() => {
      window.location.href = '/top-score'
    })
    .catch(error => {
      console.error('Error', error)
      alert('Hubo un problema al guardar el juego. Intenta nuevamente')
    })
  }
});
