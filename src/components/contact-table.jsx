import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

export function ContactTable({ contacts, onEdit, onDelete, onAddEdit }) {
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEditStart = (contact) => {
    setEditingRow(contact);
    setEditedValues({ ...contact });
  };

  const handleEditCancel = () => {
    setEditingRow(null);
    setEditedValues({});
  };

  const handleEditSave = () => {
    if (editingRow && editedValues) {
      onEdit({ ...editingRow, ...editedValues });
      setEditingRow(null);
      setEditedValues({});
    }
  };

  const handleCellEdit = (cell, value) => {
    setEditedValues({
      ...editedValues,
      [cell]: value,
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
        Cell: ({ row }) => {
          const isEditing = editingRow?.id === row.original.id;
          return isEditing ? (
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editedValues.name || row.original.name}
              onChange={(e) => handleCellEdit("name", e.target.value)}
            />
          ) : (
            row.original.name
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "Creado",
        Cell: ({ row }) => {
          const isEditing = editingRow?.id === row.original.id;
          return isEditing ? (
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editedValues.createdAt || row.original.createdAt}
              onChange={(e) => handleCellEdit("createdAt", e.target.value)}
            />
          ) : (
            row.original.createdAt.split("T")[0]
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Modificado",
        Cell: ({ row }) => {
          const isEditing = editingRow?.id === row.original.id;
          return isEditing ? (
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editedValues.updatedAt || row.original.updatedAt}
              onChange={(e) => handleCellEdit("updatedAt", e.target.value)}
            />
          ) : (
            row.original.updatedAt.split("T")[0]
          );
        },
      },
    ],
    [editingRow, editedValues]
  );

  const table = useMaterialReactTable({
    columns,
    data: contacts,
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => {
      const isEditing = editingRow?.id === row.original.id;

      return isEditing ? (
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Salvar">
            <IconButton color="primary" onClick={handleEditSave}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancelar">
            <IconButton onClick={handleEditCancel}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Editar">
            <IconButton onClick={() => onAddEdit(row.original)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Borrar">
            <IconButton color="error" onClick={() => onDelete(row.original.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
}
