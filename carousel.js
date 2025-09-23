// carousel.js
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('masters-carousel');
  const btn = document.getElementById('masters-btn');
  const closeBtn = document.querySelector('.close-btn');
  const slides = [
    { src: 'images/masters/grad_day.jpg', caption: 'Meeting other grad students the first week.' },
    { src: 'images/masters/teaching_1.jpg', caption: 'Teaching evolution through horse bones.' },
    { src: 'images/masters/library.jpg', caption: 'Working late nights in the beautiful libraries.' },
    { src: 'images/masters/dino_hat.jpg', caption: 'Celebrating holiday cheer with a Cretaceous friend.' },
    { src: 'images/masters/cohort2.jpg', caption: 'Chilling with the cohort.' },
    { src: 'images/masters/grad2.jpg', caption: 'Taking lots of grad pictures.' },
    { src: 'images/masters/grad3.jpg', caption: 'Lots.' }
  ];
  let current = 0;

  // Only run if the carousel elements exist on the page
  if (!btn || !carousel) return;

  btn.addEventListener('click', () => {
    carousel.style.display = 'flex';
    showSlide(current);
  });

  closeBtn.addEventListener('click', () => {
    carousel.style.display = 'none';
  });

  function showSlide(index) {
    const img = carousel.querySelector('img');
    const caption = carousel.querySelector('.caption');
    img.src = slides[index].src;
    caption.textContent = slides[index].caption;
  }

  document.querySelector('.prev').addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  document.querySelector('.next').addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });
});
