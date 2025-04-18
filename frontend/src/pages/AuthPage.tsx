import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "./shared-theme/AppTheme";
import ColorModeSelect from "./shared-theme/ColorModeSelect";
import axios from "axios";
import { setCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import AutoForm from "../components/AutoForm";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function AuthPage({
  method,
}: {
  method: "sign-in" | "sign-up";
}) {
  const navigate = useNavigate();

  const handleSubmit = async (inputs: Record<string, string>) => {
    const {
      data: { accessToken, refreshToken },
    } = await axios.post(`auth/${method}`, inputs);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setCookie("accessToken", accessToken, 1);
    setCookie("refreshToken", refreshToken, 7);
    navigate("/dashboard");
  };

  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      autoComplete: "email",
      placeholder: "your@email.com",
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errorMessage: "Please enter a valid email address.",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: method === "sign-in" ? "current-password" : "new-password",
      placeholder: "••••••••",
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
      errorMessage:
        "Password must be at least 8 characters long and contain at least " +
        "one lowercase letter, one uppercase letter, one number, and one " +
        "special character.",
    },
  ];

  if (method === "sign-up") {
    fields.unshift({
      name: "name",
      label: "Name",
      type: "text",
      autoComplete: "name",
      placeholder: "John Doe",
      pattern: /^(?!\s*$).+/,
      errorMessage: "Name is required.",
    });
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            {method === "sign-in" ? "Sign In" : "Sign Up"}
          </Typography>
          <AutoForm
            onSubmit={handleSubmit}
            fields={fields}
            buttonText={method === "sign-in" ? "Sign In" : "Sign Up"}
          />
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              {method === "sign-in"
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                href={method === "sign-in" ? "/sign-up" : "/sign-in"}
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                {method === "sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
