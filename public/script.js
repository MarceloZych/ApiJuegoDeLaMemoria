document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card')
  let selectedCards = []

  cards.forEach(card => {
    card.addEventListener('click', () => {

      const img = card.querySelector('.card-img')
      const imgSrc = img.getAttribute('data-image')

      if (img.getAttribute('src') === 'img/images.jpg') {
        img.setAttribute('src', imgSrc)
        selectedCards.push(card)
      }

      if (selectedCards.length === 2) {
        setTimeout(() => {
          checkForMatch(selectedCards)
          selectedCards = []
        }, 1000)
      }
    })
  })

  const checkForMatch = (cards) => {
    const img1 = cards[0].querySelector('.card-img').getAttribute('data-image')
    const img2 = cards[1].querySelector('.card-img').getAttribute('data-image')

    if (img1 === img2) {
      cards[0].querySelector('.card-img').setAttribute('data-status', 'destapada')
      cards[1].querySelector('.card-img').setAttribute('data-status', 'destapada')
    } else {
      cards[0].querySelector('.card-img').setAttribute('src', 'img/images.jpg')
      cards[1].querySelector('.card-img').setAttribute('src', 'img/images.jpg')
    }
  }
})
