class Node {
    constructor(task, description, dueDate, category) {
        this.task = task;
        this.description = description;
        this.dueDate = dueDate;
        this.category = category;
        this.isComplete = false;
        this.next = null;
    }
}

class CompletedNode {
    constructor(task, description, dueDate, category) {
        this.task = task;
        this.description = description;
        this.dueDate = dueDate;
        this.category = category;
        this.next = null;
    }
}

class TaskQueue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.completedHead = null;
        this.completedCount = 0;
        this.totalCount = 0; // Track the total number of tasks
    }

    isEmpty() {
        return this.front === null;
    }

    // Add task
    enqueue(task, description, dueDate, category) {
        const today = new Date();
        const taskDate = new Date(dueDate);

        // Validate date: must not be in the past and within one year
        if (
            isNaN(taskDate) ||
            taskDate < today ||
            taskDate > new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
        ) {
            console.log(`Invalid due date: ${dueDate}. Please enter a future date within one year.`);
            return;
        }

        const newNode = new Node(task, description, dueDate, category);
        this.totalCount++;

        if (this.isEmpty()) {
            this.front = this.rear = newNode;
        } else {
            let current = this.front;
            let prev = null;

            while (current !== null && current.dueDate <= newNode.dueDate) {
                prev = current;
                current = current.next;
            }

            if (prev === null) {
                newNode.next = this.front;
                this.front = newNode;
            } else {
                newNode.next = current;
                prev.next = newNode;
                if (current === null) this.rear = newNode;
            }
        }

        console.log(`Task "${task}" added successfully.`);
    }

    // Remove the highest priority task
    dequeueHighestPriority() {
        if (this.isEmpty()) {
            console.log("Queue is empty, cannot dequeue.");
            return;
        }
        const temp = this.front;
        this.front = this.front.next;
        this.totalCount--;
        console.log(`Task "${temp.task}" [Due: ${temp.dueDate}] removed successfully.`);
        if (this.front === null) this.rear = null;
    }

    // View all tasks
    viewTasks() {
        if (this.isEmpty()) {
            console.log("No tasks available.");
            return;
        }

        console.log("Current Tasks:");
        let curr = this.front;
        let index = 1;
        while (curr !== null) {
            console.log(
                `${index++}. ${curr.task} [Due: ${curr.dueDate}, Status: ${curr.isComplete ? "Complete" : "Incomplete"}]`
            );
            curr = curr.next;
        }
    }

    // Mark a task as complete
    markComplete(taskName) {
        let curr = this.front;
        let prev = null;

        while (curr !== null) {
            if (curr.task === taskName) {
                const completedTask = new CompletedNode(curr.task, curr.description, curr.dueDate, curr.category);
                this.completedCount++;
                completedTask.next = this.completedHead;
                this.completedHead = completedTask;

                if (prev === null) {
                    this.front = curr.next;
                } else {
                    prev.next = curr.next;
                }

                console.log(`Task "${curr.task}" marked as complete.`);
                if (this.front === null) this.rear = null;
                return;
            }
            prev = curr;
            curr = curr.next;
        }

        console.log(`Task not found: "${taskName}".`);
    }

    // Undo a completed task
    undoCompleted() {
        if (this.completedHead === null) {
            console.log("No completed tasks to undo.");
            return;
        }

        const temp = this.completedHead;
        this.completedHead = this.completedHead.next;
        this.enqueue(temp.task, temp.description, temp.dueDate, temp.category);
        this.completedCount--;
        console.log(`Task "${temp.task}" has been undone.`);
    }

    // Edit a task
    editTask(taskName, newTask, newDescription, newDueDate, newCategory) {
        let curr = this.front;
        while (curr !== null) {
            if (curr.task === taskName) {
                this.deleteTask(taskName);
                this.enqueue(newTask, newDescription, newDueDate, newCategory);
                console.log("Task updated successfully.");
                return;
            }
            curr = curr.next;
        }
        console.log(`Task not found: "${taskName}".`);
    }

    // Delete a task
    deleteTask(taskName) {
        if (this.isEmpty()) {
            console.log("Queue is empty, cannot delete.");
            return;
        }
        let curr = this.front;
        let prev = null;
        while (curr !== null) {
            if (curr.task === taskName) {
                if (prev === null) {
                    this.front = curr.next;
                } else {
                    prev.next = curr.next;
                }
                if (curr === this.rear) {
                    this.rear = prev;
                }
                console.log(`Task "${curr.task}" deleted successfully.`);
                return;
            }
            prev = curr;
            curr = curr.next;
        }
        console.log(`Task not found: "${taskName}".`);
    }

    // View completed tasks
    viewCompletedTasks() {
        if (this.completedHead === null) {
            console.log("No completed tasks available.");
            return;
        }
        console.log("Completed Tasks:");
        let curr = this.completedHead;
        let index = 1;
        while (curr !== null) {
            console.log(`${index++}. ${curr.task} [Due: ${curr.dueDate}]`);
            curr = curr.next;
        }
    }

    // Show progress
    showProgress() {
        const totalTasks = this.totalCount;
        const progress = totalTasks === 0 ? 0.0 : (this.completedCount / totalTasks) * 100;
        console.log(`Progress: ${progress}%`);
    }

    // View tasks by a category
    viewTasksByCategory(category) {
        if (this.isEmpty()) {
            console.log("No tasks available.");
            return;
        }
        console.log(`Tasks in category "${category}":`);
        let curr = this.front;
        let found = false;
        while (curr !== null) {
            if (curr.category === category) {
                console.log(
                    `- ${curr.task} [Due: ${curr.dueDate}, Status: ${curr.isComplete ? "Complete" : "Incomplete"}]`
                );
                found = true;
            }
            curr = curr.next;
        }
        if (!found) console.log("No tasks found in this category.");
    }

    // Display the task with the latest deadline
    displayLatestDeadlineTask() {
        if (this.isEmpty()) {
            console.log("No tasks available.");
            return;
        }
        let latestTask = this.front;
        let curr = this.front;

        while (curr !== null) {
            if (new Date(curr.dueDate) > new Date(latestTask.dueDate)) {
                latestTask = curr;
            }
            curr = curr.next;
        }

        console.log(
            `Task with the latest deadline: "${latestTask.task}" [Due: ${latestTask.dueDate}, Category: ${latestTask.category}, Status: ${latestTask.isComplete ? "Complete" : "Incomplete"}]`
        );
    }

    // Clear all tasks
    clearAllTasks() {
        if (this.isEmpty()) {
            console.log("No tasks to clear.");
            return;
        }
        console.log("Clearing all tasks...");
        while (!this.isEmpty()) this.dequeueHighestPriority();
        console.log("All tasks cleared successfully.");
    }
}

// Main function
function main() {
    const queue = new TaskQueue();
    let choice;

    do {
        console.log("1. Add Task");
        console.log("2. View Tasks");
        console.log("3. Complete Task");
        console.log("4. Undo Completed Task");
        console.log("5. Edit Task");
        console.log("6. Delete Task");
        console.log("7. View Completed Tasks");
        console.log("8. Show Progress");
        console.log("9. Dequeue Highest Priority Task");
        console.log("10. View Tasks by Category");
        console.log("11. View Latest Deadline Task");
        console.log("12. Clear All Tasks");
        console.log("0. Exit");

        choice = prompt("Enter your choice: ");

        switch (parseInt(choice)) {
            case 1: {
                const task = prompt("Enter task: ");
                const description = prompt("Enter description: ");
                let dueDate;
                while (true) {
                    dueDate = prompt("Enter due date (YYYY-MM-DD): ");
                    const today = new Date();
                    const taskDate = new Date(dueDate);

                    if (
                        !isNaN(taskDate) &&
                        taskDate >= today &&
                        taskDate <= new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
                    ) {
                        break;
                    }

                    console.log(`Invalid due date: ${dueDate}. Please enter a valid future date within one year.`);
                }
                const category = prompt("Enter category: ");
                queue.enqueue(task, description, dueDate, category);
                break;
            }

            case 2:
                queue.viewTasks();
                break;

            case 3: {
                const taskName = prompt("Enter task to mark as complete: ");
                queue.markComplete(taskName);
                break;
            }

            case 4:
                queue.undoCompleted();
                break;

            case 5: {
                const taskName = prompt("Enter task to edit: ");
                const newTask = prompt("Enter new task: ");
                const newDescription = prompt("Enter new description: ");
                const newDueDate = prompt("Enter new due date (YYYY-MM-DD): ");
                const newCategory = prompt("Enter new category: ");
                queue.editTask(taskName, newTask, newDescription, newDueDate, newCategory);
                break;
            }

            case 6: {
                const taskName = prompt("Enter task to delete: ");
                queue.deleteTask(taskName);
                break;
            }

            case 7:
                queue.viewCompletedTasks();
                break;

            case 8:
                queue.showProgress();
                break;

            case 9:
                queue.dequeueHighestPriority();
                break;

            case 10: {
                const category = prompt("Enter category to view tasks: ");
                queue.viewTasksByCategory(category);
                break;
            }

            case 11:
                queue.displayLatestDeadlineTask();
                break;

            case 12:
                queue.clearAllTasks();
                break;

            case 0:
                console.log("Exiting...");
                break;

            default:
                console.log("Invalid choice. Please try again.");
        }
    } while (choice !== "0");
}

// Start the program
main();
