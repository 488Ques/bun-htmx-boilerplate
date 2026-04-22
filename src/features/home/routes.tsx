import { Hono } from "hono";
import { createTask, deleteTask, listTasks, toggleTask } from "./store";
import HomePage from "./views/HomePage";
import TaskItem from "./views/TaskItem";

const home = new Hono();

home.get("/", (c) => {
  return c.render(<HomePage tasks={listTasks()} />, {
    title: "Bun HTMX Boilerplate",
  });
});

home.post("/tasks", async (c) => {
  const body = await c.req.formData();
  const title = body.get("title");

  if (typeof title !== "string" || title.trim().length < 2) {
    return c.body("Task title must be at least 2 characters.", 422);
  }

  const task = createTask(title);
  return c.html(<TaskItem task={task} />);
});

home.post("/tasks/:id/toggle", (c) => {
  const task = toggleTask(Number(c.req.param("id")));

  if (!task) {
    return c.notFound();
  }

  return c.html(<TaskItem task={task} />);
});

home.delete("/tasks/:id", (c) => {
  const deleted = deleteTask(Number(c.req.param("id")));

  if (!deleted) {
    return c.notFound();
  }

  return c.body(null, 200);
});

export default home;
