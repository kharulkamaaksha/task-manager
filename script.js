const taskQueue = new TaskQueue();

// Utility function to clear a container
function clearContainer(containerId) {
    document.getElementById(containerId).innerHTML = '';
}

// Add Task
document.getElementById('addTaskBtn').addEventListener('click', () => {
    const task = document.getElementById('task').value.trim();
    const description = document.getElementById('description').value.trim();
    const dueDate = document.getElementById('dueDate').value.trim();
    const category = document.getElementById('category').value.trim();

    if (!task || !description || !dueDate || !category) {
        alert('Please fill all fields.');
        return;
    }

    taskQueue.enqueue(task, description, dueDate, category);
    alert(`Task "${task}" added successfully!`);
});

// View All Tasks
document.getElementById('viewTasksBtn').addEventListener('click', () => {
    clearContainer('tasksContainer');
    const tasksContainer = document.getElementById('tasksContainer');

    if (taskQueue.isEmpty()) {
        tasksContainer.innerHTML = '<p>No tasks available.</p>';
        return;
    }

    let curr = taskQueue.front;
    while (curr) {
        const taskElement = document.createElement('div');
        taskElement.innerHTML = `
            <p><strong>${curr.task}</strong> - ${curr.description}</p>
            <p>Due Date: ${curr.dueDate}</p>
            <p>Category: ${curr.category}</p>
            <button onclick="markComplete('${curr.task}')">Mark Complete</button>
            <button onclick="deleteTask('${curr.task}')">Delete</button>
        `;
        tasksContainer.appendChild(taskElement);
        curr = curr.next;
    }
});

// Mark Task as Complete
function markComplete(taskName) {
    taskQueue.markComplete(taskName);
    alert(`Task "${taskName}" marked as complete.`);
    document.getElementById('viewTasksBtn').click();
}

// Delete Task
function deleteTask(taskName) {
    taskQueue.deleteTask(taskName);
    alert(`Task "${taskName}" deleted successfully.`);
    document.getElementById('viewTasksBtn').click();
}

// View Completed Tasks
document.getElementById('viewCompletedBtn').addEventListener('click', () => {
    clearContainer('completedTasksContainer');
    const completedTasksContainer = document.getElementById('completedTasksContainer');

    if (taskQueue.completedHead === null) {
        completedTasksContainer.innerHTML = '<p>No completed tasks.</p>';
        return;
    }

    let curr = taskQueue.completedHead;
    while (curr) {
        const completedTaskElement = document.createElement('div');
        completedTaskElement.innerHTML = `
            <p><strong>${curr.task}</strong> - ${curr.description}</p>
            <p>Due Date: ${curr.dueDate}</p>
            <p>Category: ${curr.category}</p>
        `;
        completedTasksContainer.appendChild(completedTaskElement);
        curr = curr.next;
    }
});

// View Tasks by Category
document.getElementById('viewTasksByCategoryBtn').addEventListener('click', () => {
    const category = prompt('Enter category:');
    clearContainer('tasksContainer');

    const tasksContainer = document.getElementById('tasksContainer');
    let curr = taskQueue.front;
    let found = false;

    while (curr) {
        if (curr.category === category) {
            const taskElement = document.createElement('div');
            taskElement.innerHTML = `
                <p><strong>${curr.task}</strong> - ${curr.description}</p>
                <p>Due Date: ${curr.dueDate}</p>
                <p>Category: ${curr.category}</p>
            `;
            tasksContainer.appendChild(taskElement);
            found = true;
        }
        curr = curr.next;
    }

    if (!found) {
        tasksContainer.innerHTML = `<p>No tasks found in category "${category}".</p>`;
    }
});

// View Latest Deadline Task
document.getElementById('latestDeadlineTaskBtn').addEventListener('click', () => {
    clearContainer('latestTaskContainer');
    const latestTaskContainer = document.getElementById('latestTaskContainer');

    if (taskQueue.isEmpty()) {
        latestTaskContainer.innerHTML = '<p>No tasks available.</p>';
        return;
    }

    let latestTask = taskQueue.front;
    let curr = taskQueue.front;

    while (curr) {
        if (new Date(curr.dueDate) > new Date(latestTask.dueDate)) {
            latestTask = curr;
        }
        curr = curr.next;
    }

    latestTaskContainer.innerHTML = `
        <p><strong>${latestTask.task}</strong> - ${latestTask.description}</p>
        <p>Due Date: ${latestTask.dueDate}</p>
        <p>Category: ${latestTask.category}</p>
    `;
});

// Show Progress
document.getElementById('showProgressBtn').addEventListener('click', () => {
    clearContainer('progressContainer');
    const progressContainer = document.getElementById('progressContainer');
    const totalTasks = taskQueue.totalCount + taskQueue.completedCount;
    const progress = totalTasks === 0 ? 0 : (taskQueue.completedCount / totalTasks) * 100;

    progressContainer.innerHTML = `<p>Progress: ${progress.toFixed(2)}%</p>`;
});

// Clear All Tasks
document.getElementById('clearTasksBtn').addEventListener('click', () => {
    taskQueue.clearAllTasks();
    alert('All tasks cleared!');
    document.getElementById('viewTasksBtn').click();
});

// Undo Completed Task
document.getElementById('undoCompletedBtn').addEventListener('click', () => {
    taskQueue.undoCompleted();
    alert('Last completed task undone.');
    document.getElementById('viewTasksBtn').click();
});
