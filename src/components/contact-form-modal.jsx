import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ContactForm } from "./contact-form";

export function ContactFormModal({ open, onClose, onSubmit, initialValues }) {
  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {initialValues ? "Editar Movie" : "Agregar Movie"}
      </DialogTitle>
      <DialogContent>
        <ContactForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
          hideButtons
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="primary"
          form="contact-form"
          type="submit"
        >
          {initialValues ? "Actualizar" : "Agregar"} Movie
        </Button>
      </DialogActions>
    </Dialog>
  );
}
