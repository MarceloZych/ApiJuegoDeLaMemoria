document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
  
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.card-img');
        const imgSrc = img.getAttribute('data-image');
        
        if (img.getAttribute('src') === 'img/images.jpg') {
          img.setAttribute('src', imgSrc);
        } else {
          img.setAttribute('src', 'img/images.jpg');
        }
      });
    });
  });  