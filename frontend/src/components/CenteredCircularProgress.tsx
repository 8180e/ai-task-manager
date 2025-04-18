import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const CenteredCircularProgress = () => (
  <Grid
    container
    alignItems="center"
    justifyContent="center"
    sx={{ height: "100vh" }}
  >
    <CircularProgress />
  </Grid>
);

export default CenteredCircularProgress;
