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
        this.totalCount = 0;
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

            while (current !== null && new Date(current.dueDate) <= new Date(newNode.dueDate)) {
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
                this.deleteTask(taskName); // Remove the old task
                this.enqueue(newTask, newDescription, newDueDate, newCategory); // Add the updated task
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
        while (!this.isEmpty()) {
            this.dequeueHighestPriority();
        }
        this.completedHead = null;
        this.completedCount = 0;
        console.log("All tasks cleared.");
    }
}

// Example usage:
const taskQueue = new TaskQueue();
taskQueue.enqueue("Task 1", "Description 1", "2024-12-01", "Work");
taskQueue.enqueue("Task 2", "Description 2", "2024-11-15", "Personal");
taskQueue.enqueue("Task 3", "Description 3", "2025-01-01", "Work");
taskQueue.viewTasks();
taskQueue.dequeueHighestPriority();
taskQueue.viewTasks();
taskQueue.markComplete("Task 3");
taskQueue.viewCompletedTasks();
taskQueue.undoCompleted();
taskQueue.viewTasks();
taskQueue.clearAllTasks();
