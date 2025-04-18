import { NLP_API_URL } from "../config/env.config.js";

async function getUrgency(task: {
  category: string;
  description: string;
  dueDate: Date;
}): Promise<"urgent" | "normal"> {
  // Use the NLP API to get the urgency of the task
  const response = await fetch(NLP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  // Get the response from the API and return the urgency
  const { urgency } = await response.json();
  return urgency;
}

export default getUrgency;
