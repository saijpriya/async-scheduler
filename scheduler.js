class Scheduler {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency; // Maximum concurrent tasks
    this.runningCount = 0; // Number of currently running tasks
    this.taskQueue = []; // Queue to store pending tasks
  }

  async addTask(task) {
    if (this.runningCount >= this.maxConcurrency) {
      // Push the task into the queue if the limit is reached
      await new Promise((resolve) => this.taskQueue.push(resolve));
    }

    // Increment the running count
    this.runningCount++;

    try {
      // Run the task
      await task();
    } finally {
      // Decrement the running count and process the next task in the queue
      this.runningCount--;
      if (this.taskQueue.length > 0) {
        const nextTask = this.taskQueue.shift();
        nextTask(); // Resolve the promise to start the next task
      }
    }
  }
}

// Example usage:
const scheduler = new Scheduler(2); // Max 2 concurrent tasks

const createTask = (id, time) => () =>
  new Promise((resolve) => {
    console.log(`Task ${id} started`);
    setTimeout(() => {
      console.log(`Task ${id} completed`);
      resolve();
    }, time);
  });

scheduler.addTask(createTask(1, 3000)); // Task 1 takes 3s
scheduler.addTask(createTask(2, 2000)); // Task 2 takes 2s
scheduler.addTask(createTask(3, 1000)); // Task 3 takes 1s
scheduler.addTask(createTask(4, 4000)); // Task 4 takes 4s
