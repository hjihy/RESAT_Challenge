  // JS 부분
        let todos = [];
        let currentList = '전체';

        function addTodo() {
            const newTodoInput = document.getElementById('newTodo');
            const prioritySelect = document.getElementById('priority');

            const newTodo = {
                text: newTodoInput.value.trim(),
                priority: prioritySelect.value,
                completed: false
            };

            if (newTodo.text !== '') {
                todos.push(newTodo);
                newTodoInput.value = '';
                displayTodos();
            }
        }

        function displayTodos() {
            const dynamicLists = document.getElementById('dynamicLists');
            dynamicLists.innerHTML = '';

            const filteredTodos = filterTodos();

            filteredTodos.forEach((todo, index) => {
                const listItem = document.createElement('div');
                listItem.className = 'list-item';

                listItem.innerHTML = `
                    <input type="checkbox" id="todo${index}" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
                    <label for="todo${index}" class="${todo.completed ? 'completed' : ''}">${todo.text} (${todo.priority})</label>
                    <button class="btn btn-sm btn-primary" onclick="editTodo(${index})">수정</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTodo(${index})">삭제</button>
                `;

                dynamicLists.appendChild(listItem);
            });

            showListButtons();
        }

        function toggleTodo(index) {
            todos[index].completed = !todos[index].completed;
            displayTodos();
        }

        function editTodo(index) {
            const newText = prompt('수정할 내용을 입력하세요:', todos[index].text);
            if (newText !== null) {
                todos[index].text = newText.trim();
                displayTodos();
            }
        }

        function deleteTodo(index) {
            todos.splice(index, 1);
            displayTodos();
        }

        function filterTodos() {
            switch (currentList) {
                case '해결':
                    return todos.filter(todo => todo.completed);
                case '미해결':
                    return todos.filter(todo => !todo.completed);
                default:
                    return todos;
            }
        }

        function showListButtons() {
            const listButtons = document.getElementById('listButtons');
            listButtons.innerHTML = '';

            const lists = ['전체', '해결', '미해결'];

            lists.forEach(list => {
                const button = document.createElement('button');
                button.className = 'btn btn-secondary mr-2';
                button.innerText = list === currentList ? '✔ ' + list : list;
                button.onclick = () => showList(list);
                listButtons.appendChild(button);
            });
        }

        function showList(listName) {
            currentList = listName;
            displayTodos();
        }
    </script>
</div>

</body>
</html>