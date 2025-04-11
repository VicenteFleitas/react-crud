import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Box, Typography } from "@mui/material";

const validationSchema = Yup.object({
  name: Yup.string().required("Completar nombre"),
  email: Yup.string().email("Correo invalido").required("Completar correo"),
  phone:
    Yup.string()
    .required("Completar contacto"),
});

export function ContactForm({ onSubmit, initialValues, hideButtons = false }) {
  const formik = useFormik({
    initialValues: initialValues || {
      id: "",
      name: "",
      email: "",
      phone: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Box
      component="form"
      id="contact-form"
      onSubmit={formik.handleSubmit}
      sx={{
        p: hideButtons ? 0 : 3,
        borderRadius: hideButtons ? 0 : 2,
        boxShadow: hideButtons ? 0 : 1,
        bgcolor: "background.paper",
        mt: hideButtons ? 2 : 0,
      }}
    >
      {!hideButtons && (
        <Typography variant="h6" gutterBottom>
          {initialValues ? "Edit Contact" : "Add New Contact"}
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          fullWidth
          id="phone"
          name="phone"
          label="Phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
        />
      </Box>
    </Box>
  );
}
