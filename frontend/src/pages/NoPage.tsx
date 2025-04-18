import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function NoPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h1">Not Found</Typography>
      <Typography variant="h4">
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="primary" href="/">
        Go Home
      </Button>
    </Box>
  );
}
