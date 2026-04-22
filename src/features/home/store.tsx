export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

let nextId = 1;

const tasks: Task[] = [
  {
    id: nextId++,
    title: "Edit the starter feature",
    completed: false,
  },
  {
    id: nextId++,
    title: "Ship a server-rendered HTMX flow",
    completed: true,
  },
];

export function listTasks() {
  return tasks;
}

export function createTask(title: string) {
  const task: Task = {
    id: nextId++,
    title: title.trim(),
    completed: false,
  };

  tasks.unshift(task);
  return task;
}

export function toggleTask(id: number) {
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return null;
  }

  task.completed = !task.completed;
  return task;
}

export function deleteTask(id: number) {
  const index = tasks.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  return true;
}
