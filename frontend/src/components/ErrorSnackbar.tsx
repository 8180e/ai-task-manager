import { lazy, useState, SyntheticEvent, useEffect, Suspense } from "react";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { AxiosError } from "axios";

const Snackbar = lazy(() => import("@mui/material/Snackbar"));
const Alert = lazy(() => import("@mui/material/Alert"));

const ErrorSnackbar = ({ error }: { error: AxiosError | null }) => {
  const [open, setOpen] = useState(!!error);

  const handleClose = (
    _event?: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason !== "clickaway") {
      setOpen(false);
    }
  };

  interface ErrorData {
    error: string;
  }

  useEffect(() => setOpen(!!error), [error]);

  return (
    <Suspense>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {/* If the error is not null, display the error message from the
        response data. Otherwise, display a generic error message. */}
          {(error?.response?.data as ErrorData)?.error ??
            "Something went wrong"}
        </Alert>
      </Snackbar>
    </Suspense>
  );
};

export default ErrorSnackbar;
