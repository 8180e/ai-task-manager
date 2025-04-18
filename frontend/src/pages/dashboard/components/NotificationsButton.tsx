import React, { lazy, useContext, useState, Suspense } from "react";
import TasksContext from "../internals/context";
import dayjs from "dayjs";
import axios from "axios";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CircularProgress from "@mui/material/CircularProgress";

const Popper = lazy(() => import("@mui/material/Popper"));
const Fade = lazy(() => import("@mui/material/Fade"));
const Paper = lazy(() => import("@mui/material/Paper"));
const Box = lazy(() => import("@mui/material/Box"));
const List = lazy(() => import("@mui/material/List"));
const ListItem = lazy(() => import("@mui/material/ListItem"));
const ListItemText = lazy(() => import("@mui/material/ListItemText"));
const Typography = lazy(() => import("@mui/material/Typography"));

const NotificationsButton = () => {
  const { tasks, setTasks } = useContext(TasksContext);

  const notifications = tasks
    .filter(({ dueDate, urgency, status }) => {
      const date = dayjs(dueDate);
      const today = dayjs();

      return (
        date.isBefore(today.add(3, "day")) &&
        date.isAfter(today.subtract(1, "day")) &&
        urgency === "urgent" &&
        status === "pending"
      );
    })
    .sort((d1, d2) => dayjs(d2.dueDate).diff(dayjs(d1.dueDate)));

  const unreadNotifications = notifications.filter(
    ({ userReminded }) => !userReminded
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
      for (const notification of unreadNotifications) {
        notification.userReminded = true;
        const response = await axios.put(
          `tasks/${notification.id}`,
          notification
        );

        setTasks(response.data);
      }
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <>
      <Badge badgeContent={unreadNotifications.length} color="error">
        <IconButton
          size="small"
          aria-label="Open notifications"
          onClick={handleClick}
        >
          <NotificationsRoundedIcon />
        </IconButton>
      </Badge>
      <Suspense>
        <Popper
          open={!!anchorEl}
          anchorEl={anchorEl}
          placement="bottom-end"
          style={{ zIndex: 99999999 }}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Paper
                elevation={1}
                sx={{
                  border: 1,
                  p: 1,
                  bgcolor: "background.paper",
                  borderColor: "divider",
                }}
              >
                <Box borderRadius={1} marginTop={0.5}>
                  <Suspense fallback={<CircularProgress />}>
                    {notifications.length ? (
                      <List>
                        {notifications.map(
                          ({ id, description, userReminded }) => (
                            <ListItem key={id}>
                              <Badge
                                variant={userReminded ? "standard" : "dot"}
                                color="error"
                                anchorOrigin={{ horizontal: "left" }}
                              >
                                <ListItemText
                                  primary="Task deadline is coming"
                                  secondary={description}
                                />
                              </Badge>
                            </ListItem>
                          )
                        )}
                      </List>
                    ) : (
                      <Typography variant="body2" sx={{ p: 1 }}>
                        No notifications
                      </Typography>
                    )}
                  </Suspense>
                </Box>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Suspense>
    </>
  );
};

export default NotificationsButton;
