import { Box, Typography, Button } from "@mui/material";

const Home = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f0f0f0"
    >
      <Typography variant="h2" gutterBottom>
        Welcome to the AI Task Manager App
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        You can manage your tasks and projects with ease with our user-friendly
        app.
      </Typography>
      <Button variant="contained" color="primary" href="/dashboard">
        Get Started
      </Button>
    </Box>
  );
};

export default Home;
