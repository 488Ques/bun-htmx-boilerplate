export default function AuthError({ message }: { message: string }) {
  return (
    <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
      {message}
    </p>
  );
}
