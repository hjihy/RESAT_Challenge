let currentSlide = 0;

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlide();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlide();
}

function updateSlide() {
  const slides = document.querySelector('.slides');
  slides.style.transform = `translateX(${-currentSlide * 100}%)`;
}

const totalSlides = document.querySelectorAll('.slide').length;
