import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { lazy, Suspense } from "react";
import Skeleton from "@mui/material/Skeleton";

const Copyright = lazy(() => import("../internals/components/Copyright"));
const FullFeaturedCrudGrid = lazy(() => import("./FullFeaturedCrudGrid"));
const TaskForm = lazy(() => import("./TaskForm"));
const Calendar = lazy(() => import("./Calendar"));

export default function MainGrid() {
  return (
    <Box
      sx={{
        // Set the width to 100% by default, but limit it to 1700px on larger
        // screens
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        // Use mobile-first approach to define the size of each grid item
        // On xs screens, each grid item takes up the full width of the screen
        // On larger screens, each grid item takes up half of the screen
        size={{ xs: 12, md: 6 }}
      >
        <Grid>
          <Suspense fallback={<Skeleton variant="rounded" />}>
            <TaskForm />
          </Suspense>
        </Grid>
        <Grid>
          <Suspense fallback={<Skeleton variant="rounded" />}>
            <FullFeaturedCrudGrid />
          </Suspense>
        </Grid>
        <Grid>
          <Suspense fallback={<Skeleton variant="rounded" />}>
            <Calendar />
          </Suspense>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
