document.addEventListener('DOMContentLoaded', () => {
const todoInput = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('#todo-list');
const template = document.querySelector('#card__template').content;

let tasks = StorageSingleton.fetch().map(t => TaskFactory.create(t));

const render = () => {
    todoList.innerHTML = '';
    tasks.forEach(task => {
    const clone = template.cloneNode(true);
    clone.querySelector('.card__title').textContent = task.title;
        if (task instanceof UrgentTask) {
            clone.querySelector('.card').style.borderLeft = '5px solid red';
        }

    todoList.appendChild(clone);
    });
};

addBtn.addEventListener('click', () => {
    const title = todoInput.value.trim();
    if (!title) return alert("Escribe una tarea");

    const newTask = TaskFactory.create({ title, isUrgent: false });

    tasks.push(newTask);
    StorageSingleton.save(tasks);
    render();
    todoInput.value = '';
});

render();
});