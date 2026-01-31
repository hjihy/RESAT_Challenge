const STORAGE_KEY = "resat_todo_v1";

// 우선순위 매핑 (정렬용 점수)
const PRIORITY_SCORE = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

const PRIORITY_LABEL = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  urgent: "아주 높음",
};

let state = {
  todos: loadTodos(),
  filter: "all",        // all | done | todo
  sort: "createdDesc",  // createdDesc | createdAsc | priorityDesc | priorityAsc
};

const $input = document.getElementById("todoInput");
const $priority = document.getElementById("prioritySelect");
const $addBtn = document.getElementById("addBtn");
const $list = document.getElementById("todoList");
const $empty = document.getElementById("emptyState");
const $stats = document.getElementById("statsText");
const $sort = document.getElementById("sortSelect");
const $segs = document.querySelectorAll(".seg");

render();

// 추가 버튼
$addBtn.addEventListener("click", () => addTodo());

// Enter로 추가
$input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

// 필터 탭
$segs.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.filter = btn.dataset.filter;
    $segs.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    render();
  });
});

// 정렬
$sort.addEventListener("change", () => {
  state.sort = $sort.value;
  render();
});

function addTodo() {
  const text = $input.value.trim();
  const priority = $priority.value;

  if (!text) {
    $input.focus();
    return;
  }

  const todo = {
    id: crypto.randomUUID(),
    text,
    priority,
    done: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  state.todos.unshift(todo);
  persist();
  $input.value = "";
  $input.focus();
  render();
}

function toggleDone(id) {
  const t = state.todos.find((x) => x.id === id);
  if (!t) return;
  t.done = !t.done;
  t.updatedAt = Date.now();
  persist();
  render();
}

function startEdit(id) {
  const t = state.todos.find((x) => x.id === id);
  if (!t) return;
  t.isEditing = true;
  render();

  // 렌더 후 포커스
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-edit-input="${id}"]`);
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  });
}

function cancelEdit(id) {
  const t = state.todos.find((x) => x.id === id);
  if (!t) return;
  t.isEditing = false;
  render();
}

function saveEdit(id, newText, newPriority) {
  const t = state.todos.find((x) => x.id === id);
  if (!t) return;

  const text = newText.trim();
  if (!text) return; // 빈 값 저장 방지

  t.text = text;
  t.priority = newPriority;
  t.isEditing = false;
  t.updatedAt = Date.now();
  persist();
  render();
}

function removeTodo(id) {
  state.todos = state.todos.filter((x) => x.id !== id);
  persist();
  render();
}

function getVisibleTodos() {
  let arr = [...state.todos];

  // filter
  if (state.filter === "done") arr = arr.filter((t) => t.done);
  if (state.filter === "todo") arr = arr.filter((t) => !t.done);

  // sort
  switch (state.sort) {
    case "createdAsc":
      arr.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case "createdDesc":
      arr.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case "priorityAsc":
      arr.sort((a, b) => PRIORITY_SCORE[a.priority] - PRIORITY_SCORE[b.priority]);
      break;
    case "priorityDesc":
      arr.sort((a, b) => PRIORITY_SCORE[b.priority] - PRIORITY_SCORE[a.priority]);
      break;
  }

  return arr;
}

function render() {
  const visible = getVisibleTodos();
  $list.innerHTML = "";

  // 통계
  const total = state.todos.length;
  const doneCount = state.todos.filter((t) => t.done).length;
  $stats.textContent = `${total}개 (해결 ${doneCount} / 미해결 ${total - doneCount})`;

  // empty state
  $empty.style.display = visible.length === 0 ? "block" : "none";

  visible.forEach((t) => {
    const li = document.createElement("li");
    li.className = "item";

    const priorityClass = `p-${t.priority}`;

    li.innerHTML = `
      <input class="check" type="checkbox" ${t.done ? "checked" : ""} aria-label="해결 체크" />
      <div class="content">
        <div class="topline">
          <p class="text ${t.done ? "done" : ""}">${escapeHtml(t.text)}</p>
          <div class="actions">
            ${
              t.isEditing
                ? `<button class="btn icon-btn" type="button" data-action="cancel">취소</button>`
                : `<button class="btn icon-btn" type="button" data-action="edit">수정</button>`
            }
            <button class="btn icon-btn" type="button" data-action="delete">삭제</button>
          </div>
        </div>

        <div class="meta">
          <span class="badge ${priorityClass}">
            <span class="dot ${t.priority}"></span>
            ${PRIORITY_LABEL[t.priority]}
          </span>
          <span>작성: ${fmtTime(t.createdAt)}</span>
          <span>수정: ${fmtTime(t.updatedAt)}</span>
        </div>

        ${
          t.isEditing
            ? `
            <div class="edit-row">
              <input class="edit-input" data-edit-input="${t.id}" type="text" maxlength="120" value="${escapeAttr(
                t.text
              )}" />
              <select class="select" data-edit-priority="${t.id}">
                ${priorityOptions(t.priority)}
              </select>
              <button class="btn primary" type="button" data-action="save">저장</button>
            </div>
          `
            : ""
        }
      </div>
    `;

    // 이벤트 바인딩
    const checkbox = li.querySelector(".check");
    checkbox.addEventListener("change", () => toggleDone(t.id));

    const editBtn = li.querySelector('[data-action="edit"]');
    if (editBtn) editBtn.addEventListener("click", () => startEdit(t.id));

    const cancelBtn = li.querySelector('[data-action="cancel"]');
    if (cancelBtn) cancelBtn.addEventListener("click", () => cancelEdit(t.id));

    const delBtn = li.querySelector('[data-action="delete"]');
    delBtn.addEventListener("click", () => removeTodo(t.id));

    const saveBtn = li.querySelector('[data-action="save"]');
    if (saveBtn) {
      const editInput = li.querySelector(`[data-edit-input="${t.id}"]`);
      const editPriority = li.querySelector(`[data-edit-priority="${t.id}"]`);

      saveBtn.addEventListener("click", () =>
        saveEdit(t.id, editInput.value, editPriority.value)
      );

      // 편집 입력에서 Enter 저장 / ESC 취소
      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveEdit(t.id, editInput.value, editPriority.value);
        }
        if (e.key === "Escape") {
          cancelEdit(t.id);
        }
      });
    }

    $list.appendChild(li);
  });
}

function priorityOptions(selected) {
  return ["low", "medium", "high", "urgent"]
    .map(
      (p) =>
        `<option value="${p}" ${p === selected ? "selected" : ""}>${PRIORITY_LABEL[p]}</option>`
    )
    .join("");
}

function fmtTime(ms) {
  const d = new Date(ms);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yy}.${mm}.${dd} ${hh}:${mi}`;
}

function persist() {
  // isEditing은 저장에서 제외
  const clean = state.todos.map(({ isEditing, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map((t) => ({
      ...t,
      isEditing: false,
    }));
  } catch {
    return [];
  }
}

// XSS 방지
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  // attribute용
  return escapeHtml(str).replaceAll("\n", " ");
}
