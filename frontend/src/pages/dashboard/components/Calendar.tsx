import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs from "dayjs";
import TasksContext from "../internals/context";
import { useContext } from "react";

export default function Calendar() {
  const { tasks } = useContext(TasksContext);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      // The height of the calendar is set to "auto" to make it
      // responsive.
      height="auto"
      // The eventTimeFormat is set to show the event time in the format
      // "hh:mm".
      eventTimeFormat={{ hour: "numeric", minute: "2-digit" }}
      // The events are set to an array of objects. Each object represents
      // an event and has the following properties:
      // - title: the title of the event
      // - date: the date of the event
      // - color: the color of the event
      events={tasks
        .filter(({ status }) => status !== "completed")
        .map(({ description, dueDate, urgency }) => ({
          title: description,
          // The date is converted to ISO format to be accepted by
          // FullCalendar.
          date: dayjs(dueDate).format("YYYY-MM-DD hh:mm"),
          color: urgency === "urgent" ? "red" : "blue",
        }))}
    />
  );
}
