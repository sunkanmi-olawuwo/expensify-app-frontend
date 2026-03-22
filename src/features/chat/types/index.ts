export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export const starterMessages: ChatMessage[] = [
  {
    id: "assistant-1",
    role: "assistant",
    text: "This route is intentionally hidden from primary navigation until the chat design and grounding model are ready.",
  },
  {
    id: "user-1",
    role: "user",
    text: "How am I doing this month?",
  },
];
