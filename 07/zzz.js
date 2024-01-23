const slides = document.querySelector('.slides');
const slideImg = document.querySelectorAll('.slides li');
let currentIdx = 0;
const slideCount = slideImg.length;
const prev = document.querySelector('.prev'); // 이전 버튼
const next = document.querySelector('.next'); // 다음 버튼

const slideInterval = 2000;
let autoSlide;

function startAutoSlide() {
  autoSlide = setInterval(() => {
    if (currentIdx === slideCount - 1) {
      moveSlide(0);
    } else {
      moveSlide(currentIdx + 1);
    }
  }, slideInterval);
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

function moveSlide(num) {
  const moveValue = -num * (slideImg[0].offsetWidth + 100);
  slides.style.transform = `translateX(${moveValue}px)`;
  currentIdx = num;
}

prev.addEventListener('click', function () {
  stopAutoSlide();
  if (currentIdx !== 0) moveSlide(currentIdx - 1);
});

next.addEventListener('click', function () {
  stopAutoSlide();
  if (currentIdx !== slideCount - 1) {
    moveSlide(currentIdx + 1);
  } else {
    moveSlide(0);
  }
});


startAutoSlide();


document.getElementById('slideShow').addEventListener('mouseenter', stopAutoSlide);


document.getElementById('slideShow').addEventListener('mouseleave', startAutoSlide);
