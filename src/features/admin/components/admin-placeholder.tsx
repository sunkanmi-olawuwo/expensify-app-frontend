export function AdminPlaceholder({ message }: { message: string }) {
  return (
    <div className="bg-surface-container-low rounded-[var(--radius-shell)] px-6 py-16 text-center sm:px-10">
      <p className="text-body-md text-muted-foreground mx-auto max-w-2xl">
        {message}
      </p>
    </div>
  );
}
