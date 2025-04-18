import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Skeleton from "@mui/material/Skeleton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const Button = lazy(() => import("@mui/material/Button"));
const MenuButton = lazy(() => import("./MenuButton"));

const LogoutButton = ({ mobile }: { mobile: boolean }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const { setCookie } = await import("../../../utils/cookies");

    setCookie("accessToken", "", -1);
    setCookie("refreshToken", "", -1);
    navigate("/");
  };

  return (
    <Suspense fallback={<Skeleton variant="circular" />}>
      {mobile ? (
        // The mobile version of the logout button is a full-width
        // outlined button with a logout icon.
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutRoundedIcon />}
          onClick={handleClick}
        >
          Logout
        </Button>
      ) : (
        // The desktop version of the logout button is a menu item with a
        // logout icon.
        <MenuButton
          text="Logout"
          icon={<LogoutRoundedIcon fontSize="small" />}
          onClick={handleClick}
        />
      )}
    </Suspense>
  );
};

export default LogoutButton;
