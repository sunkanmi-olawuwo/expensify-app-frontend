import { PageHeader, SurfaceCard } from "@/ui/composite";

import { ChatComposer } from "../components/chat-composer";
import { starterMessages } from "../types";

export function ChatScreen() {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="The route exists now so future AI work has a stable home, but it stays out of the visible nav until product design is ready."
        eyebrow="AI Chat"
        title="Keep the chat surface grounded, private, and deliberately unfinished."
      />

      <SurfaceCard
        description="Use this page as a placeholder for the grounded chat interface and message retrieval flow."
        eyebrow="Conversation"
        title="Route scaffold only"
      >
        <div className="space-y-4">
          {starterMessages.map((message) => (
            <div
              key={message.id}
              className={`max-w-3xl rounded-[calc(var(--radius-shell)-0.55rem)] p-4 ${
                message.role === "assistant"
                  ? "bg-surface-container-low"
                  : "ml-auto bg-[rgb(42_63_122_/_0.1)]"
              }`}
            >
              <p className="text-label-sm text-muted-foreground">
                {message.role}
              </p>
              <p className="text-body-md text-foreground mt-2">
                {message.text}
              </p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <ChatComposer />
    </div>
  );
}
