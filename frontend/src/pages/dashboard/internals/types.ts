export type Tasks = {
  id: string;
  category: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  urgency: "normal" | "urgent";
  dueDate: string;
  userReminded: boolean;
}[];
