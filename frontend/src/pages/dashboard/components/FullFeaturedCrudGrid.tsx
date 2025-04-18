import { lazy, useEffect, useState, useContext, Suspense } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import TasksContext from "../internals/context";
import ErrorSnackbar from "../../../components/ErrorSnackbar";

const Chip = lazy(() => import("@mui/material/Chip"));
const GridActionsCellItem = lazy(async () => ({
  default: (await import("@mui/x-data-grid")).GridActionsCellItem,
}));
const EditIcon = lazy(() => import("@mui/icons-material/Edit"));
const DeleteIcon = lazy(() => import("@mui/icons-material/DeleteOutlined"));
const SaveIcon = lazy(() => import("@mui/icons-material/Save"));
const CancelIcon = lazy(() => import("@mui/icons-material/Close"));

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }
}

export default function FullFeaturedCrudGrid() {
  const { tasks, setTasks } = useContext(TasksContext);

  const [rows, setRows] = useState<GridRowsProp>(tasks);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [error, setError] = useState<AxiosError | null>(null);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () =>
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

  const handleSaveClick = (id: GridRowId) => () =>
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

  const handleDeleteClick = (id: GridRowId) => async () => {
    const response = await axios.delete(`tasks/${id}`);
    setTasks(response.data);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const response = await axios.put(`tasks/${newRow.id}`, newRow);
    setTasks(response.data);
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) =>
    setRowModesModel(newRowModesModel);

  const handleProcessRowUpdateError = (error: AxiosError) => setError(error);

  enum StatusColor {
    pending = "warning",
    "in-progress" = "primary",
    completed = "success",
  }

  enum UrgencyColor {
    normal = "success",
    urgent = "error",
  }

  const renderChip = (colorType: typeof StatusColor | typeof UrgencyColor) => {
    const ChipComponent = ({ value }: GridRenderCellParams) => (
      <Suspense fallback={<Skeleton variant="rounded" />}>
        <Chip
          label={value}
          color={colorType[value as keyof typeof colorType]}
          variant="outlined"
        />
      </Suspense>
    );
    return ChipComponent;
  };

  const columns: GridColDef[] = [
    { field: "category", headerName: "Category", width: 200, editable: true },
    {
      field: "description",
      headerName: "Description",
      width: 600,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      valueOptions: ["pending", "in-progress", "completed"],
      width: 125,
      editable: true,
      renderCell: renderChip(StatusColor),
    },
    {
      field: "urgency",
      headerName: "Urgency",
      width: 125,
      editable: true,
      type: "singleSelect",
      valueOptions: ["normal", "urgent"],
      renderCell: renderChip(UrgencyColor),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      type: "dateTime",
      width: 200,
      editable: true,
      valueFormatter: ({ value }) => dayjs(value).format("DD/MM/YYYY hh:mm A"),
      valueGetter: (value) => new Date(value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <Suspense
              key={`save-${id}`}
              fallback={<Skeleton variant="rounded" />}
            >
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(id)}
              />
            </Suspense>,
            <Suspense
              key={`cancel-${id}`}
              fallback={<Skeleton variant="rounded" />}
            >
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />
            </Suspense>,
          ];
        }

        return [
          <Suspense
            key={`edit-${id}`}
            fallback={<Skeleton variant="rounded" />}
          >
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
          </Suspense>,
          <Suspense
            key={`delete-${id}`}
            fallback={<Skeleton variant="rounded" />}
          >
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          </Suspense>,
        ];
      },
    },
  ];

  useEffect(() => setRows(tasks), [tasks]);

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <ErrorSnackbar error={error} />
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
