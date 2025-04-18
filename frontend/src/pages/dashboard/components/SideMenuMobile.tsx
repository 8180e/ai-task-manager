import { lazy, Suspense } from "react";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import UserInformations from "./UserInformations";
import NotificationsButton from "./NotificationsButton";

const LogoutButton = lazy(() => import("./LogoutButton"));

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({
  open,
  toggleDrawer,
}: SideMenuMobileProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        // Set the z-index to be higher than the drawer's default z-index.
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // Set the background color of the drawer to match the background color
        // of the app.
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack sx={{ maxWidth: "70dvw", height: "100%" }}>
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            <UserInformations mobile />
          </Stack>
          <NotificationsButton />
        </Stack>
        <Divider />
        <Stack sx={{ p: 2 }}>
          <Suspense>
            <LogoutButton mobile />
          </Suspense>
        </Stack>
      </Stack>
    </Drawer>
  );
}
