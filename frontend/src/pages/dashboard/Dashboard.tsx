import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import { getCookie } from "../../utils/cookies";
import { Navigate } from "react-router-dom";
import { lazy, useState, useEffect, Suspense } from "react";
import { Tasks } from "./internals/types";
import axios from "axios";
import TasksContext from "./internals/context";
import CenteredCircularProgress from "../../components/CenteredCircularProgress";

const MainGrid = lazy(() => import("./components/MainGrid"));

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard() {
  // The tasks state, stored in the TasksContext. It is initially set to an
  // empty array, and is updated when the component mounts.
  const [tasks, setTasks] = useState<Tasks>([]);

  if (!getCookie("refreshToken")) {
    return <Navigate to="/sign-in" />;
  }

  useEffect(() => {
    async function fetchTasks() {
      const response = await axios.get("/tasks");
      setTasks(response.data);
    }

    fetchTasks();
  }, []);

  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <TasksContext.Provider value={{ tasks, setTasks }}>
          <AppNavbar />
          {/* Main content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: "auto",
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header />
              <Suspense fallback={<CenteredCircularProgress />}>
                <MainGrid />
              </Suspense>
            </Stack>
          </Box>
        </TasksContext.Provider>
      </Box>
    </AppTheme>
  );
}
