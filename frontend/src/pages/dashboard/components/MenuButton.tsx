import MenuItem from "@mui/material/MenuItem";
import { listItemIconClasses } from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ReactNode } from "react";

export default function MenuButton({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <MenuItem
      sx={{
        // The following styles are needed to display the icon to the right of
        // the text.
        // See https://mui.com/material-ui/react-list for more information.
        [`& .${listItemIconClasses.root}`]: { ml: "auto", minWidth: 0 },
      }}
      onClick={onClick}
    >
      <ListItemText>{text}</ListItemText>
      <ListItemIcon>{icon}</ListItemIcon>
    </MenuItem>
  );
}
