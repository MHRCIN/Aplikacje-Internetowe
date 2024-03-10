const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTask');
const taskDueDateInput = document.getElementById('taskDueDate');
const dateField = document.createElement('input');
let tasks = [];
document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        renderTasks();
    }
});
document.addEventListener('click', (event) => {
    const isOutsideTaskList = !taskList.contains(event.target);

    if (isOutsideTaskList) {
        // End editing mode for all tasks
        tasks.forEach((task, index) => {
            const taskItem = document.getElementById(`taskItem_${index}`);
            if (taskItem.classList.contains('editing')) {
                endEditing(taskItem, index, taskItem.querySelector('input').value, dateField.value);
            }
        });
    }
});

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        let taskInfo = `${task.task}`;
        if (task.dueDate) {
            taskInfo += ` ${task.dueDate}`;
        }
        listItem.innerHTML = `
      <input type="checkbox" id="checkbox_${index}" onchange="toggleTaskCompletion(${index})" ${task.completed ? 'checked' : ''}>
      <span id="taskItem_${index}" onclick="editTask(${index})" style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${taskInfo}</span>
      <button onclick="deleteTask(${index})">Usuń</button>
    `;
        taskList.appendChild(listItem);
    });
}
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
    saveTasksToLocalStorage();
}
taskList.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'SPAN') {
        const index = parseInt(target.id.split('_')[1], 10);
        editTask(index);
    }
});

function addTask() {
    const newTask = newTaskInput.value;
    const dueDate = taskDueDateInput.value;

    if (!newTask || newTask.length < 3 || newTask.length > 255) {
        alert('Zadanie musi mieć od 3 do 255 znaków.');
        return;
    }

    const taskInfo = { task: newTask, completed: false };
    if (dueDate && new Date(dueDate) > new Date()) {
        taskInfo.dueDate = dueDate;
    }

    tasks.push(taskInfo);
    renderTasks();
    saveTasksToLocalStorage();
    newTaskInput.value = '';
    taskDueDateInput.value = '';
}

function editTask(index) {
    const taskItem = document.getElementById(`taskItem_${index}`);

    // Sprawdź, czy zadanie jest już w trybie edycji
    if (taskItem.classList.contains('editing')) {
        return;  // Jeśli tak, zakończ
    }

    taskItem.classList.add('editing');  // Dodaj klasę 'editing' do oznaczenia trybu edycji

    const originalTask = tasks[index].task;
    const originalDueDate = tasks[index].dueDate;

    // Stwórz pole tekstowe do edycji
    const inputField = document.createElement('input');
    inputField.value = originalTask;
    inputField.addEventListener('blur', () => {
        endEditing(taskItem, index, inputField.value, originalDueDate);
    });

    dateField.type = 'datetime-local';
    dateField.value = originalDueDate || '';
    dateField.addEventListener('change', () => {
        tasks[index].dueDate = dateField.value || null;
        saveTasksToLocalStorage();
    });

    taskItem.innerHTML = '';  // Wyczyść zawartość
    taskItem.appendChild(inputField);
    taskItem.appendChild(dateField);

    inputField.focus();  // Ustaw fokus na polu tekstowym
}

// Funkcja kończąca edycję
function endEditing(taskItem, index, updatedTask, originalDueDate) {
    // Usuń tryb edycji
    taskItem.classList.remove('editing');

    // Aktualizuj zadanie tylko jeśli zmieniono tekst
    if (updatedTask !== tasks[index].task || originalDueDate !== tasks[index].dueDate) {
        tasks[index].task = updatedTask;
        tasks[index].dueDate = originalDueDate !== dateField.value ? dateField.value || null : originalDueDate;
        renderTasks();
        saveTasksToLocalStorage();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function validateInput() {
    const newTask = newTaskInput.value;
    const addButton = document.querySelector('button');

    if (!newTask || newTask.length < 3 || newTask.length > 255) {
        addButton.disabled = true;
    } else {
        addButton.disabled = false;
    }
}

function filterTasks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const listItems = document.querySelectorAll('#taskList li');

    listItems.forEach(item => {
        const taskTextElement = item.querySelector('span'); // Znajdź element span z tekstem zadania

        const taskText = taskTextElement.innerText;
        const originalHTML = taskTextElement.innerHTML;

        if (taskText.includes(searchInput)) {
            const highlightedText = taskText.replace(
                new RegExp(searchInput, 'gi'),
                match => `<span style="background-color: yellow">${match}</span>`
            );
            taskTextElement.innerHTML = highlightedText;
            item.style.display = 'flex';  // Pokaż element
        } else {
            taskTextElement.innerHTML = originalHTML;
            item.style.display = 'none';  // Ukryj element
        }
    });
}
