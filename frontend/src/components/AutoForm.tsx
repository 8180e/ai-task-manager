import { lazy, useState, Suspense } from "react";
import ErrorSnackbar from "../components/ErrorSnackbar";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Skeleton from "@mui/material/Skeleton";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { AxiosError } from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const LocalizationProvider = lazy(async () => ({
  default: (await import("@mui/x-date-pickers")).LocalizationProvider,
}));
const DateTimePicker = lazy(async () => ({
  default: (await import("@mui/x-date-pickers")).DateTimePicker,
}));

const AutoForm = ({
  onSubmit,
  fields,
  buttonText = "Submit",
}: {
  onSubmit: (inputs: Record<string, string>) => Promise<void>;
  fields: {
    name: string;
    label: string;
    pattern?: RegExp;
    errorMessage?: string;
    [index: string]: unknown;
  }[];
  buttonText?: string;
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<AxiosError | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let error = false;

    event.preventDefault();

    for (const { name, pattern, errorMessage } of fields) {
      if (
        (!inputs[name] || (pattern && !pattern.test(inputs[name]))) &&
        errorMessage
      ) {
        setErrors((values) => ({ ...values, [name]: errorMessage }));
        error = true;
      } else {
        setErrors((values) => ({ ...values, [name]: "" }));
      }
    }

    if (!error) {
      try {
        await onSubmit(inputs);
      } catch (error) {
        setServerError(error as AxiosError);
      }
    }
  };

  const handleChange = ({
    target: { name, value },
  }: {
    target: { name: string; value: string };
  }) => setInputs((values) => ({ ...values, [name]: value }));

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
    >
      <ErrorSnackbar error={serverError} />
      {fields.map(
        ({ inputType, name, label, pattern, errorMessage, ...field }, index) =>
          inputType === "date" ? (
            <Suspense key={name} fallback={<Skeleton variant="rounded" />}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label={label}
                  minDateTime={dayjs()}
                  value={dayjs(inputs[name])}
                  onChange={(newValue: dayjs.Dayjs | null) =>
                    handleChange({
                      target: { name, value: newValue?.toISOString() || "" },
                    })
                  }
                  {...field}
                />
              </LocalizationProvider>
            </Suspense>
          ) : (
            <FormControl key={name}>
              <FormLabel htmlFor={name}>{label}</FormLabel>
              <TextField
                error={!!errors[name]}
                helperText={errors[name]}
                id={name}
                name={name}
                value={inputs[name] || ""}
                onChange={handleChange}
                autoFocus={index === 0}
                required
                fullWidth
                variant="outlined"
                color={errors[name] ? "error" : "primary"}
                {...field}
              />
            </FormControl>
          )
      )}
      <Button type="submit" variant="contained" fullWidth>
        {buttonText}
      </Button>
    </Box>
  );
};

export default AutoForm;
