import type { Task } from "../store";
import TaskItem from "./TaskItem";

export default function HomePage({ tasks }: { tasks: Task[] }) {
  return (
    <main class="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950">
      <section class="mx-auto grid w-full max-w-3xl gap-8">
        <header class="grid gap-3">
          <p class="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Bun + Hono + HTMX
          </p>
          <div class="grid gap-2">
            <h1 class="text-4xl font-bold tracking-normal">
              Server-rendered starter app
            </h1>
            <p class="max-w-2xl text-base leading-7 text-zinc-600">
              A compact boilerplate with JSX views, Tailwind CSS, static assets,
              and HTMX-powered fragments ready for your first feature.
            </p>
          </div>
        </header>

        <section class="grid gap-4">
          <form
            hx-post="/tasks"
            hx-target="#task-list"
            hx-swap="afterbegin"
            hx-on-htmx-after-request="if(event.detail.successful) this.reset()"
            class="grid grid-cols-[1fr_auto] gap-2"
          >
            <input
              type="text"
              name="title"
              required
              minlength={2}
              placeholder="Add a task..."
              class="h-11 min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="submit"
              class="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Add
            </button>
          </form>

          <ul id="task-list" class="grid gap-2">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
