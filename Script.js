(function () {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const filters = document.querySelectorAll('.filter');
  const itemsLeftEl = document.getElementById('items-left');
  const clearCompletedBtn = document.getElementById('clear-completed');


  let todos = [];
  let filter = 'all';

  try {
    const saved = JSON.parse(localStorage.getItem('simple_todos'));
    if (Array.isArray(saved)) {
      todos = saved;
    }
  } catch (e) {}

  function save() {
    localStorage.setItem('simple_todos', JSON.stringify(todos));
  }

  function render() {
    list.innerHTML = '';
    const filtered = todos.filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });

    filtered.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', `Mark ${todo.text} as ${todo.completed ? 'active' : 'completed'}`);
      checkbox.addEventListener('change', () => {
        todo.completed = !todo.completed;
        updateItemsLeft();
        save();
        render();
      });

      const text = document.createElement('div');
      text.className = `todo-text ${todo.completed ? 'completed' : ''}`;
      text.textContent = todo.text;

      const actions = document.createElement('div');
      actions.className = 'actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn icon-btn edit';
      editBtn.setAttribute('aria-label', `Edit ${todo.text}`);
      editBtn.textContent = '✎';
      editBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'edit-input';
        
   
        let saved = false;

        const saveEdit = () => {
          if (saved) return;
          saved = true;
          const val = input.value.trim();
          if (val) {
            todo.text = val;
            save();
          }
          render();
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            saveEdit();
          } else if (e.key === 'Escape') {
            saved = true; 
            render();
          }
        });

        li.replaceChild(input, text);
        input.focus();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn icon-btn delete';
      deleteBtn.setAttribute('aria-label', `Delete ${todo.text}`);
      deleteBtn.textContent = '✕';
      deleteBtn.addEventListener('click', () => {
        todos = todos.filter(t => t.id !== todo.id);
        updateItemsLeft();
        save();
        render();
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(actions);

      list.appendChild(li);
    });

    updateItemsLeft();
  }

  function updateItemsLeft() {
    const activeCount = todos.filter(t => !t.completed).length;
    itemsLeftEl.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    todos.push({ id: Date.now(), text: value, completed: false });
    input.value = '';
    save();
    render();
  });

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filter = btn.dataset.filter;
      render();
    });
  });

  clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.completed);
    save();
    render();
  });

  render();
})();