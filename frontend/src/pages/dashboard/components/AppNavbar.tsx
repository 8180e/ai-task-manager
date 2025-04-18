import { useState } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiToolbar from "@mui/material/Toolbar";
import { tabsClasses } from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SideMenuMobile from "./SideMenuMobile";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import IconButton from "@mui/material/IconButton";

const Toolbar = styled(MuiToolbar)({
  width: "100%",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  gap: "12px",
  flexShrink: 0,
  [`& ${tabsClasses.list}`]: {
    gap: "8px",
    p: "8px",
    pb: 0,
  },
});

export default function AppNavbar() {
  // The state of the drawer.
  // The drawer is open if the state is true, and closed if the state is false.
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  return (
    <AppBar
      position="fixed"
      sx={{
        // The navbar is only visible on small screens
        display: { xs: "auto", md: "none" },
        // The navbar should have no shadow and a white background
        boxShadow: 0,
        bgcolor: "background.paper",
        backgroundImage: "none",
        // The navbar should have a bottom border
        borderBottom: "1px solid",
        borderColor: "divider",
        // The navbar should be below the template frame
        top: "var(--template-frame-height, 0px)",
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            // The stack should be centered horizontally
            alignItems: "center",
            // The stack should take up the full width of the navbar
            flexGrow: 1,
            width: "100%",
            // The stack should have a gap of 1rem between its children
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              // The stack should be centered horizontally
              justifyContent: "center",
              // The stack should have a margin of 1rem on the right
              mr: "auto",
            }}
          >
            <CustomIcon />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                // The typography should have a black color
                color: "text.primary",
              }}
            >
              Dashboard
            </Typography>
          </Stack>
          <ColorModeIconDropdown />
          <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </IconButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export function CustomIcon() {
  return (
    <Box
      sx={{
        width: "1.5rem",
        height: "1.5rem",
        bgcolor: "black",
        borderRadius: "999px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundImage:
          "linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)",
        color: "hsla(210, 100%, 95%, 0.9)",
        border: "1px solid",
        borderColor: "hsl(210, 100%, 55%)",
        boxShadow: "inset 0 2px 5px rgba(255, 255, 255, 0.3)",
      }}
    >
      <DashboardRoundedIcon color="inherit" sx={{ fontSize: "1rem" }} />
    </Box>
  );
}
