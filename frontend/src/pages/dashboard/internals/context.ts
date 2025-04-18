import { createContext } from "react";
import { Tasks } from "./types";

const TasksContext = createContext<{
  tasks: Tasks;
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>;
}>({ tasks: [], setTasks: () => {} });

export default TasksContext;
