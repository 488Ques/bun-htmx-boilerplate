export default function LoginPage() {
  return (
    <main class="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <div class="w-full max-w-sm">
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p class="mt-2 text-base text-zinc-600">Sign in to your account</p>
        </div>

        <div class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div id="auth-error" class="mb-4"></div>

          <form
            hx-post="/auth/login"
            hx-target="#auth-error"
            hx-swap="innerHTML"
            class="grid gap-4"
          >
            <div class="grid gap-2">
              <label
                for="login-email"
                class="text-sm font-medium text-zinc-700"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                required
                class="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder="you@example.com"
              />
            </div>

            <div class="grid gap-2">
              <label
                for="login-password"
                class="text-sm font-medium text-zinc-700"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                required
                class="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              class="h-10 w-full rounded-md bg-zinc-950 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Sign in
            </button>
          </form>

          <p class="mt-4 text-center text-sm text-zinc-600">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              class="font-medium text-emerald-700 hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
