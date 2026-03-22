import { Button } from "@/ui/base";

export function ChatComposer() {
  return (
    <form className="bg-surface-container-low shadow-ambient-sm rounded-[calc(var(--radius-shell)-0.35rem)] p-4">
      <label className="block">
        <span className="text-label-sm text-muted-foreground">
          Ask a finance question
        </span>
        <textarea
          className="text-body-md text-foreground focus:border-primary/20 mt-3 min-h-32 w-full resize-none rounded-[1rem] border border-transparent bg-white px-4 py-3 ring-0 outline-none"
          placeholder="How did subscriptions affect this month's net cash flow?"
        />
      </label>
      <div className="mt-4 flex justify-end">
        <Button type="submit">Submit prompt</Button>
      </div>
    </form>
  );
}
