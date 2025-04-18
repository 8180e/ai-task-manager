import Stack from "@mui/material/Stack";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import NotificationsButton from "./NotificationsButton";
import UserInformations from "./UserInformations";
import OptionsMenu from "./OptionsMenu";

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      {/* The NavbarBreadcrumbs component is used to show the breadcrumbs and
      the logo */}
      <NavbarBreadcrumbs />
      {/* The Stack component is used to group the other components of the
      header */}
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* The NotificationsButton component is used to show the number of
        notifications */}
        <NotificationsButton />
        {/* The ColorModeIconDropdown component is used to switch between light
        and dark mode */}
        <ColorModeIconDropdown />
        {/* The UserInformations component is used to show the user
        informations */}
        <UserInformations mobile={false} />
        {/* The OptionsMenu component is used to show the options for the
        user */}
        <OptionsMenu />
      </Stack>
    </Stack>
  );
}
