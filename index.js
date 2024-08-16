document.addEventListener('DOMContentLoaded', () => {
  const todoInput = document.getElementById('todo-input');
  const todoForm = document.getElementById('todo-form');
  const todoList = document.getElementById('todo-list');
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categoryForm = document.getElementById('category-form');
  const categoryInput = document.getElementById('category-input');
  const categoryList = document.getElementById('category-list');
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let categories = JSON.parse(localStorage.getItem('categories')) || [];

  const saveToLocalStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('categories', JSON.stringify(categories));
  };

  const renderTodos = (filter = 'all', searchText = '') => {
    todoList.innerHTML = '';
    let filteredTodos = todos.filter(todo => {
      return (
        (filter === 'all' || (filter === 'completed' && todo.completed) || (filter === 'uncompleted' && !todo.completed)) &&
        todo.text.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    filteredTodos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';
      li.innerHTML = `
              <span>${todo.text}</span>
              <div>
                  <button class="edit-btn">✏️</button>
                  <button class="complete-btn">✔</button>
                  <button class="delete-btn">✖</button>
              </div>
          `;
      li.querySelector('.complete-btn').addEventListener('click', () => {
        todos[index].completed = !todos[index].completed;
        saveToLocalStorage();
        renderTodos(filter, searchText);
      });
      li.querySelector('.delete-btn').addEventListener('click', () => {
        todos.splice(index, 1);
        saveToLocalStorage();
        renderTodos(filter, searchText);
      });
      li.querySelector('.edit-btn').addEventListener('click', () => {
        const newTask = prompt('Редактировать задачу', todo.text);
        if (newTask !== null && newTask.trim() !== '') {
          todos[index].text = newTask.trim();
          saveToLocalStorage();
          renderTodos(filter, searchText);
        }
      });
      todoList.appendChild(li);
    });
  };

  const renderCategories = () => {
    categoryList.innerHTML = '';
    categories.forEach((category, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
              <span>${category}</span>
              <button class="delete-category-btn">✖</button>
          `;
      li.querySelector('.delete-category-btn').addEventListener('click', () => {
        categories.splice(index, 1);
        saveToLocalStorage();
        renderCategories();
      });
      li.addEventListener('click', () => {
        todoInput.value = `${category}: `;
        todoInput.focus();
      });
      categoryList.appendChild(li);
    });
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderTodos(button.dataset.filter, searchInput.value);
    });
  });

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTodo = {
      text: todoInput.value,
      completed: false,
    };
    todos.push(newTodo);
    saveToLocalStorage();
    renderTodos();
    todoInput.value = '';
  });

  categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCategory = categoryInput.value.trim();
    if (newCategory && !categories.includes(newCategory)) {
      categories.push(newCategory);
      saveToLocalStorage();
      renderCategories();
    }
    categoryInput.value = '';
  });

  searchInput.addEventListener('input', () => {
    renderTodos(document.querySelector('.filter-btn.active').dataset.filter, searchInput.value);
  });

  renderTodos();
  renderCategories();
});
