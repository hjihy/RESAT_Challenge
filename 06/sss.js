const slides = document.querySelector('.slides');
const slideImg = document.querySelectorAll('.slides li');
let currentIdx = 0;
const slideCount = slideImg.length;
const prev = document.querySelector('.prev'); // 이전 버튼
const next = document.querySelector('.next'); // 다음 버튼

function moveSlide(num) {
  const moveValue = -num * (slideImg[0].offsetWidth + 100);
  slides.style.transform = `translateX(${moveValue}px)`;
  currentIdx = num;
}

prev.addEventListener('click', function () {
  if (currentIdx !== 0) moveSlide(currentIdx - 1);
});

next.addEventListener('click', function () {
  if (currentIdx !== slideCount - 1) {
    moveSlide(currentIdx + 1);
  }
});
