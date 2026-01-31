document.addEventListener("DOMContentLoaded", () => {

  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  const addBtn = document.getElementById("addBtn");
  const list = document.getElementById("list");
  const filterBtns = document.querySelectorAll(".btn-filter");

  let todos = [];
  let filter = "all";

  // 추가 기능
  addBtn.addEventListener("click", addTodo);

  taskInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") addTodo();
  });

  // 필터 기능
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      render();
    });
  });

  function addTodo(){
    const text = taskInput.value.trim();
    if(!text) return;

    todos.push({
      id: Date.now(),
      text,
      priority: prioritySelect.value,
      done: false
    });

    taskInput.value = "";
    render();
  }

  function render(){
    list.innerHTML = "";

    let filtered = todos;

    if(filter === "done"){
      filtered = todos.filter(t => t.done);
    }
    if(filter === "todo"){
      filtered = todos.filter(t => !t.done);
    }

    filtered.forEach(todo => {

      const div = document.createElement("div");
      div.className = "item";

      div.innerHTML = `
        <div class="left">
          <input type="checkbox" ${todo.done ? "checked" : ""}>
          <span class="task ${todo.done ? "done" : ""}">
            ${todo.text} (${todo.priority})
          </span>
        </div>

        <div class="right">
          <button class="btn-edit">수정</button>
          <button class="btn-del">삭제</button>
        </div>
      `;

      // 체크박스
      div.querySelector("input").addEventListener("change", () => {
        todo.done = !todo.done;
        render();
      });

      // 삭제
      div.querySelector(".btn-del").addEventListener("click", () => {
        todos = todos.filter(t => t.id !== todo.id);
        render();
      });

      // 수정
      div.querySelector(".btn-edit").addEventListener("click", () => {
        const newText = prompt("수정할 내용을 입력하세요:", todo.text);

        if(newText && newText.trim() !== ""){
          todo.text = newText.trim();
          render();
        }
      });

      list.appendChild(div);
    });
  }

});
