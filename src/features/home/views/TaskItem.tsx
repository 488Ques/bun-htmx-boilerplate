import type { Task } from "../store";

export default function TaskItem({ task }: { task: Task }) {
  return (
    <li
      id={`task-${task.id}`}
      class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-zinc-200 bg-white p-3 shadow-sm"
    >
      <form
        hx-post={`/tasks/${task.id}/toggle`}
        hx-target="closest li"
        hx-swap="outerHTML"
      >
        <button
          type="submit"
          aria-label={
            task.completed ? "Mark task incomplete" : "Mark task complete"
          }
          class={[
            "grid size-7 place-items-center rounded-full border text-sm transition",
            task.completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-zinc-300 bg-white text-transparent hover:border-emerald-500",
          ].join(" ")}
        >
          ✓
        </button>
      </form>

      <span
        class={[
          "min-w-0 text-sm font-medium",
          task.completed ? "text-zinc-400 line-through" : "text-zinc-900",
        ].join(" ")}
      >
        {task.title}
      </span>

      <form
        hx-delete={`/tasks/${task.id}`}
        hx-target="closest li"
        hx-swap="outerHTML"
      >
        <button
          type="submit"
          aria-label="Delete task"
          class="rounded-md px-2 py-1 text-sm text-zinc-500 transition hover:bg-rose-50 hover:text-rose-600"
        >
          ×
        </button>
      </form>
    </li>
  );
}
