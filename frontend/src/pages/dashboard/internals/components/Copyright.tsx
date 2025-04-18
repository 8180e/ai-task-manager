import Link from "@mui/material/Link";
import Typography, { TypographyProps } from "@mui/material/Typography";

export default function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: "text.secondary",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/8180e">
        Emirhan Ceylan
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
