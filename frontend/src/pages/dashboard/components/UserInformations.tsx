import { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

interface User {
  name: string;
  email: string;
}

const UserInformations = ({ mobile }: { mobile: boolean }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await axios.get("/user");
      setUser(response.data);
    }

    fetchUser();
  }, []);

  return mobile ? (
    user ? (
      <>
        <Avatar
          sizes="small"
          alt={user.name}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 24, height: 24 }}
        />
        <Typography component="p" variant="h6">
          {user.name}
        </Typography>
      </>
    ) : (
      <>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={100} />
      </>
    )
  ) : user ? (
    <>
      <Avatar
        sizes="small"
        alt={user.name}
        src="/static/images/avatar/7.jpg"
        sx={{ width: 36, height: 36 }}
      />
      <Box sx={{ mr: "auto" }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, lineHeight: "16px" }}
        >
          {user.name}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {user.email}
        </Typography>
      </Box>
    </>
  ) : (
    <>
      <Skeleton variant="circular" width={36} height={36} />
      <Box sx={{ mr: "auto" }}>
        <Skeleton variant="text" sx={{ fontSize: "16px" }} width={100} />
        <Skeleton variant="text" sx={{ fontSize: "12px" }} width={100} />
      </Box>
    </>
  );
};

export default UserInformations;
