let todos = [];
let currentList = "전체";

const input = document.getElementById("newTodo");
const priority = document.getElementById("priority");
const addBtn = document.getElementById("addBtn");

const dynamicLists = document.getElementById("dynamicLists");
const listButtons = document.getElementById("listButtons");

/* Enter로 추가 */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

/* 버튼 클릭 추가 */
addBtn.addEventListener("click", addTodo);

/* 할 일 추가 */
function addTodo() {
  const text = input.value.trim();
  if (text === "") return;

  todos.push({
    id: crypto.randomUUID(),
    text: text,
    priority: priority.value,
    completed: false,
  });

  input.value = "";
  displayTodos();
}

/* 리스트 출력 */
function displayTodos() {
  dynamicLists.innerHTML = "";

  const filteredTodos = filterTodos();

  filteredTodos.forEach((todo) => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class="left">
        <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}">
        <label class="${todo.completed ? "completed" : ""}">
          ${todo.text} (${todo.priority})
        </label>
      </div>

      <div class="actions">
        <button class="btn edit-btn" data-action="edit" data-id="${todo.id}">
          수정
        </button>
        <button class="btn delete-btn" data-action="delete" data-id="${todo.id}">
          삭제
        </button>
      </div>
    `;

    dynamicLists.appendChild(div);
  });

  showListButtons();
}

/* 체크박스 처리 */
dynamicLists.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    toggleTodo(e.target.dataset.id);
  }
});

/* 수정/삭제 처리 */
dynamicLists.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;

  if (btn.dataset.action === "edit") editTodo(id);
  if (btn.dataset.action === "delete") deleteTodo(id);
});