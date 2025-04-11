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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {initialValues ? "Edit Contact" : "Add New Contact"}
      </DialogTitle>
      <DialogContent>
        <ContactForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
          hideButtons
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          form="contact-form"
          type="submit"
        >
          {initialValues ? "Update" : "Add"} Contact
        </Button>
      </DialogActions>
    </Dialog>
  );
}
