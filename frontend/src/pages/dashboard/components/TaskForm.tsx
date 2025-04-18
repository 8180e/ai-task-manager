import AutoForm from "../../../components/AutoForm";
import axios from "axios";
import TasksContext from "../internals/context";
import { useContext } from "react";

const TaskForm = () => {
  const { setTasks } = useContext(TasksContext);

  const handleSubmit = async (inputs: Record<string, string>) => {
    const response = await axios.post("/tasks", inputs);

    setTasks(response.data);
  };

  return (
    <AutoForm
      onSubmit={handleSubmit}
      fields={[
        {
          name: "category",
          label: "Category",
          pattern: /^.{3,}$/, // Ensures category is at least 3 characters long
          errorMessage: "Category must be at least 3 characters long",
        },
        {
          name: "description",
          label: "Description",
          // Ensures description is at least 10 characters long
          pattern: /^.{10,}$/,
          errorMessage: "Description must be at least 10 characters long",
        },
        { name: "dueDate", label: "Due Date", inputType: "date" },
      ]}
    />
  );
};

export default TaskForm;
