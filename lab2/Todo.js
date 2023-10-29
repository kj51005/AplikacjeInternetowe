class Todo {
    constructor() {
      this.tasks = this.loadTasksFromLocalStorage(); // Odczytaj zadania z LocalStorage
      this.editingIndex = -1; // Indeks edytowanego zadania (-1, jeśli brak edycji)
      this.term = ''; // Właściwość do przechowywania frazy wyszukiwania
      this.draw();
      this.bindEvents();
    }
  
    // Metoda dodająca nowe zadanie do listy
    addTask(taskText) {
      this.tasks.push({ text: taskText, completed: false });
      this.saveTasksToLocalStorage(); // Zapisz zadania do LocalStorage
      this.draw();
    }
  
    // Metoda usuwająca zadanie z listy na podstawie indeksu
    removeTask(index) {
      if (index >= 0 && index < this.tasks.length) {
        this.tasks.splice(index, 1);
        this.saveTasksToLocalStorage(); // Zapisz zadania do LocalStorage
        this.editingIndex = -1; // Zakończ edycję po usunięciu zadania
        this.draw();
      }
    }
  
    removeTaskById(id) {
      const index = parseInt(id.split('-')[1]);
      if (!isNaN(index) && index >= 0 && index < this.tasks.length) {
        this.tasks.splice(index, 1);
        this.saveTasksToLocalStorage(); // Zapisz zadania do LocalStorage
        this.editingIndex = -1; // Zakończ edycję po usunięciu zadania
        this.draw();
      }
    }
  
    updateSearchTerm(term) {
      this.term = term;
      this.draw();
    }
  
    get filteredTasks() {
      return this.tasks.filter(task => {
        return task.text.toLowerCase().includes(this.term.toLowerCase());
      });
    }
  
    // Metoda oznaczająca zadanie jako ukończone/nieukończone
    toggleTaskCompletion(index) {
      if (index >= 0 && index < this.tasks.length) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasksToLocalStorage(); // Zapisz zadania do LocalStorage
        this.draw();
      }
    }
  
    // Metoda edytująca zadanie na podstawie indeksu
    editTask(index, newText) {
      if (index >= 0 && index < this.tasks.length) {
        this.tasks[index].text = newText;
        this.editingIndex = -1; // Zakończ edycję po zapisaniu zmian
        this.saveTasksToLocalStorage(); // Zapisz zadania do LocalStorage
        this.draw();
      }
    }
  
    // Metoda odczytująca zadania z LocalStorage
    loadTasksFromLocalStorage() {
      const tasksJSON = localStorage.getItem('tasks');
      return tasksJSON ? JSON.parse(tasksJSON) : [];
    }
  
    // Metoda zapisująca zadania do LocalStorage
    saveTasksToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  
    // Metoda generująca widok listy zadań
draw() {
    const todoList = document.getElementById('todo-list');

    // Wyczyść poprzednią zawartość listy
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }

    // Wygeneruj nowy widok listy
    this.tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';

        // Podświetlenie dopasowanych fragmentów tekstu
        const taskText = task.text;
        const searchText = this.term;
        const textParts = taskText.split(new RegExp(`(${searchText})`, 'gi'));

        for (const part of textParts) {
            const textElement = document.createElement('span');
            if (part.toLowerCase() === searchText.toLowerCase()) {
                textElement.classList.add('highlight');
            }
            textElement.textContent = part;
            listItem.appendChild(textElement);
        }

        if (task.completed) {
            listItem.classList.add('completed');
        }

        // Przycisk "Usuń"
const removeButton = document.createElement('button');
removeButton.textContent = 'Usuń';
removeButton.className = 'remove-button';

removeButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Zapobiegaj propagacji zdarzenia do rodzica (li)
    this.removeTask(index);
});

listItem.appendChild(removeButton);

// Dodaj obsługę edycji po kliknięciu na li (poza przyciskiem "Usuń")
listItem.addEventListener('click', () => {
    if (this.editingIndex === -1) {
        this.editingIndex = index;
        const newText = prompt('Edytuj zadanie:', task.text);
        if (newText !== null) {
            this.editTask(index, newText);
        }
    }
});

        todoList.appendChild(listItem);
    });

    // Ukryj elementy, które nie pasują do wyników wyszukiwania
    this.tasks.forEach((task, index) => {
        const listItem = document.getElementsByClassName('task-item')[index];
        if (this.term && task.text.toLowerCase().indexOf(this.term.toLowerCase()) === -1) {
            listItem.style.display = 'none';
        }
    });
}

  
    // Metoda obsługująca kliknięcie poza polem listy
    handleClickOutsideList(event) {
      if (this.editingIndex !== -1) {
        const target = event.target;
        const todoList = document.getElementById('todo-list');
        if (target !== todoList) {
          this.editTask(this.editingIndex, todoList.children[this.editingIndex].textContent);
          this.editingIndex = -1;
        }
      }
    }
  
    // Metoda dołączająca obsługę zdarzeń
    bindEvents() {
      document.addEventListener('click', (event) => this.handleClickOutsideList(event));
      const searchInput = document.getElementById('search');
      searchInput.addEventListener('input', (event) => this.updateSearchTerm(event.target.value));
  
      // Dodaj obsługę zdarzenia kliknięcia przycisku "Dodaj"
      const addItemButton = document.getElementById('add-item');
      addItemButton.addEventListener('click', () => {
        const newItemInput = document.getElementById('new-item');
        const newItemText = newItemInput.value;
        if (newItemText.trim() !== '') {
          this.addTask(newItemText);
          newItemInput.value = ''; // Wyczyść pole tekstowe po dodaniu zadania
        }
      });
  
      // Dodaj obsługę usuwania elementów z listy (event delegation)
      todoList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
          const listItem = event.target.parentNode;
          const id = listItem.id;
          this.removeTaskById(id);
        }
      });
    }
  }
  
  // Utworzenie obiektu Todo
  const todo = new Todo();