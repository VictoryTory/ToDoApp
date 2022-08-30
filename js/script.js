'use strict';

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const emptyList = document.querySelector('#emptyList');

// if (localStorage.getItem('taskHTML')) {
//     taskList.innerHTML = localStorage.getItem('taskHTML');
// }

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach( (task) => renderTask(task));
}

checkEmptyList()

function addTask(e) {
    //очистити строку
    e.preventDefault();

    //створила константу, яка забирає значення з інпуту
    const taskText = taskInput.value

    //описала задачу у вигляді задачі
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    //додаю задачу в массив із задачами
    tasks.push(newTask);

    saveToLocalStorage()

    renderTask(newTask);

    //очищує значення в інпуті
    taskInput.value = '';
    //залишає фокус
    taskInput.focus();

    checkEmptyList()
}

function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.task-group-item');

    //Виявляю id задачі
    const id = Number(parentNode.id);

    // Знаходжу індекс задачі в масиві
    // const index = tasks.findIndex( (task) => task.id === id);

    //Видалити задачу із массиву з задачами
    // tasks.splice(index, 1)

    //Видалити задачу через фільтрацію масиву
    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage()

    parentNode.remove();

    checkEmptyList()
}

function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;
    const parentNode = event.target.closest('.task-group-item');

    //виявляємо id задачі
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done

    saveToLocalStorage()

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title__done');
}

function checkEmptyList() {
    if (tasks.length === 0 ) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group__item">
            <img class="img" src="img/Calendar.png" alt="empty">
            <div class="empty-list__title">
                Task list is empty
            </div>
        </li>`
        taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

//НЕправильний метод збереження данних після перезавантаження, перезаписування HTML
// function saveHTMLtoLS() {
//     localStorage.setItem('taskHTML', taskList.innerHTML);
// }

//Додавання задачі
form.addEventListener('submit', addTask);

//Видалення задачі
taskList.addEventListener('click', deleteTask);

//Виконання задачі
taskList.addEventListener('click', doneTask);

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    //формую css клас
    const cssClass = task.done ? "task-title task-title__done" : "task-title";

    //елемент html, в якому буде зберігатися шаблон і текст, що був введений в інпут
    const taskHTML = `
    <li id='${task.id}' class="task-group-item">
        <span class="${cssClass}">
            ${task.text}
        </span>
        <div class="task-item-buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="img/Check.png" alt="#">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="img/Close.png" alt="#">
            </button>
        </div>
    </li>
    `;
    //додає елемен вкінці
    taskList.insertAdjacentHTML('beforeend', taskHTML);
}