let totalSeconds = 0;
let intervalId = null;
let running = false;

const $hh = document.getElementById("hh");
const $mm = document.getElementById("mm");
const $ss = document.getElementById("ss");

const $inputArea = document.getElementById("inputArea");
const $display = document.getElementById("display");
const $msg = document.getElementById("msg");

const $startBtn = document.getElementById("startBtn");
const $stopBtn = document.getElementById("stopBtn");
const $resetBtn = document.getElementById("resetBtn");

$startBtn.addEventListener("click", onStart);
$stopBtn.addEventListener("click", onStop);
$resetBtn.addEventListener("click", onReset);

// 숫자 입력 보정(음수 방지, 범위 제한)
[$hh, $mm, $ss].forEach((el) => {
  el.addEventListener("input", () => {
    const max = Number(el.max);
    let v = Number(el.value);
    if (Number.isNaN(v)) v = 0;
    if (v < 0) v = 0;
    if (max && v > max) v = max;
    el.value = String(v);
  });
});

function onStart() {
  // 이미 실행 중이면 무시
  if (running) return;

  // 입력 영역이 보이는 상태(=처음 시작)면 입력값으로 세팅
  if (!$inputArea.classList.contains("hidden")) {
    const h = toInt($hh.value);
    const m = toInt($mm.value);
    const s = toInt($ss.value);

    totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds <= 0) {
      setMsg("시간/분/초를 1 이상 입력해줘.");
      return;
    }

    // START 누르면 입력 영역 사라짐(요청사항)
    $inputArea.classList.add("hidden");
    setMsg("");
  } else {
    // 입력 숨김 상태에서 START = 일시정지 후 재개
    if (totalSeconds <= 0) {
      setMsg("남은 시간이 없어. RESET 후 다시 입력해줘.");
      return;
    }
  }

  running = true;
  tick(); // 바로 1번 표시 갱신
  intervalId = setInterval(tick, 1000);
}

function onStop() {
  if (!intervalId) {
    running = false;
    return;
  }
  clearInterval(intervalId);
  intervalId = null;
  running = false;
  setMsg("일시정지됨. START로 재개 가능.");
}

function onReset() {
  // 요청사항: 모든 항목 0으로 초기화 + 입력 영역 다시 보이기
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  running = false;

  totalSeconds = 0;
  $display.textContent = "00:00:00";

  $hh.value = "";
  $mm.value = "";
  $ss.value = "";

  $inputArea.classList.remove("hidden");
  setMsg("초기화 완료. 다시 시간/분/초를 입력해줘.");
}

function tick() {
  // 표시 갱신
  $display.textContent = formatTime(totalSeconds);

  if (totalSeconds <= 0) {
    // 종료
    clearInterval(intervalId);
    intervalId = null;
    running = false;
    setMsg("완료!");
    return;
  }

  totalSeconds -= 1;
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toInt(v) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : n;
}

function setMsg(text) {
  $msg.textContent = text;
}
