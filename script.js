// DOM Elements
const taskInput = document.getElementById('task');
const descriptionInput = document.getElementById('description');
const dueDateInput = document.getElementById('dueDate');
const categoryInput = document.getElementById('category');
const addTaskBtn = document.getElementById('addTaskBtn');
const viewTasksBtn = document.getElementById('viewTasksBtn');
const viewCompletedBtn = document.getElementById('viewCompletedBtn');
const viewTasksByCategoryBtn = document.getElementById('viewTasksByCategoryBtn');
const latestDeadlineTaskBtn = document.getElementById('latestDeadlineTaskBtn');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const showProgressBtn = document.getElementById('showProgressBtn');
const undoCompletedBtn = document.getElementById('undoCompletedBtn');
const tasksContainer = document.getElementById('tasksContainer');
const completedTasksContainer = document.getElementById('completedTasksContainer');
const latestTaskContainer = document.getElementById('latestTaskContainer');

// In-memory storage for tasks
let tasks = [];
let completedTasks = [];

// Helper function to create task HTML
function createTaskHTML(task, isCompleted = false) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    if (isCompleted) taskElement.classList.add('completed-task');

    taskElement.innerHTML = `
        <h3>${task.name}</h3>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Due Date:</strong> ${task.dueDate}</p>
        <p><strong>Category:</strong> ${task.category}</p>
        <button onclick="markTaskCompleted('${task.name}')">Complete Task</button>
    `;
    return taskElement;
}

// Add new task
addTaskBtn.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    const taskDescription = descriptionInput.value.trim();
    const taskDueDate = dueDateInput.value;
    const taskCategory = categoryInput.value.trim();

    // Validate date (can't be in the past)
    const currentDate = new Date().toISOString().split('T')[0];
    if (taskDueDate < currentDate) {
        alert('Due date cannot be in the past!');
        return;
    }

    if (!taskName || !taskDescription || !taskDueDate || !taskCategory) {
        alert('Please fill in all fields');
        return;
    }

    const newTask = {
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        category: taskCategory
    };

    tasks.push(newTask);

    // Clear the inputs
    taskInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    categoryInput.value = '';

    renderTasks();
});

// Mark task as completed
function markTaskCompleted(taskName) {
    const taskIndex = tasks.findIndex(task => task.name === taskName);
    if (taskIndex === -1) return;

    const completedTask = tasks.splice(taskIndex, 1)[0];
    completedTasks.push(completedTask);

    renderTasks();
}

// Render tasks
function renderTasks() {
    tasksContainer.innerHTML = '';
    completedTasksContainer.innerHTML = '';
    latestTaskContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskHTML(task);
        tasksContainer.appendChild(taskElement);
    });

    completedTasks.forEach(task => {
        const taskElement = createTaskHTML(task, true);
        completedTasksContainer.appendChild(taskElement);
    });
}

// View all tasks
viewTasksBtn.addEventListener('click', () => {
    tasksContainer.style.display = 'block';
    completedTasksContainer.style.display = 'none';
    latestTaskContainer.style.display = 'none';
});

// View completed tasks
viewCompletedBtn.addEventListener('click', () => {
    tasksContainer.style.display = 'none';
    completedTasksContainer.style.display = 'block';
    latestTaskContainer.style.display = 'none';
});

// View tasks by category
viewTasksByCategoryBtn.addEventListener('click', () => {
    const category = prompt('Enter category to view tasks:');
    const filteredTasks = tasks.filter(task => task.category.toLowerCase() === category.toLowerCase());

    tasksContainer.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskElement = createTaskHTML(task);
        tasksContainer.appendChild(taskElement);
    });
});

// Show task with the latest deadline
latestDeadlineTaskBtn.addEventListener('click', () => {
    const latestTask = tasks.reduce((latest, current) => {
        return new Date(current.dueDate) > new Date(latest.dueDate) ? current : latest;
    }, tasks[0]);

    latestTaskContainer.innerHTML = '';
    const taskElement = createTaskHTML(latestTask);
    latestTaskContainer.appendChild(taskElement);
    tasksContainer.style.display = 'none';
    completedTasksContainer.style.display = 'none';
    latestTaskContainer.style.display = 'block';
});

// Clear all tasks
clearTasksBtn.addEventListener('click', () => {
    tasks = [];
    completedTasks = [];
    renderTasks();
});

// Show progress (percentage of tasks completed)
showProgressBtn.addEventListener('click', () => {
    const totalTasks = tasks.length + completedTasks.length;
    if (totalTasks === 0) {
        alert('No tasks to show progress!');
        return;
    }

    const completedPercentage = (completedTasks.length / totalTasks) * 100;
    alert(`Completed tasks: ${completedPercentage.toFixed(2)}%`);
});

// Undo last completed task
undoCompletedBtn.addEventListener('click', () => {
    if (completedTasks.length === 0) {
        alert('No completed tasks to undo!');
        return;
    }

    const lastCompletedTask = completedTasks.pop();
    tasks.push(lastCompletedTask);
    renderTasks();
});

