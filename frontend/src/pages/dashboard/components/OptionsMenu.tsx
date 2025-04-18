import React, { lazy, useState, Suspense } from "react";
import { dividerClasses } from "@mui/material/Divider";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import IconButton from "@mui/material/IconButton";

const Menu = lazy(() => import("@mui/material/Menu"));
const LogoutButton = lazy(() => import("./LogoutButton"));

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        {/* The icon for the menu button */}
        <MoreVertRoundedIcon />
      </IconButton>
      <Suspense>
        <Menu
          anchorEl={anchorEl}
          id="menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{
            // The styles for the list.
            [`& .${listClasses.root}`]: {
              padding: "4px",
            },
            // The styles for the paper.
            [`& .${paperClasses.root}`]: {
              padding: 0,
            },
            // The styles for the divider.
            [`& .${dividerClasses.root}`]: {
              margin: "4px -4px",
            },
          }}
        >
          <LogoutButton mobile={false} />
        </Menu>
      </Suspense>
    </>
  );
}
