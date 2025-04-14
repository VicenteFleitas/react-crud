import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import useFetch from "../hooks/useFetch";

const validationSchema = Yup.object({
  name: Yup.string().required("Completar nombre"),
  studio: Yup.number().required("Seleccionar studio"),
  producer: Yup.number().required("Seleccionar producer"),
});

export function ContactForm({ onSubmit, initialValues, hideButtons = false }) {
  const { fetchData, loading, response, error } = useFetch();
  const studios = useFetch();
  const movieById = useFetch();

  useEffect(() => {
    // get producers list
    fetchData({
      url: "/v1/producers/list",
      method: "GET",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    });
    // get studios list
    studios.fetchData({
      url: "/v1/studios/list",
      method: "GET",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    });
    // get movie by id
    if (initialValues) {
      movieById.fetchData({
        url: `/v1/movies/${initialValues.id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            "access_token"
          )}`,
        },
      });
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: movieById?.response
      ? {
          id: movieById.response.id,
          name: movieById.response.name,
          studio: movieById.response.studios[0].id,
          producer: movieById.response.producers[0].id,
        }
      : {
          id: "",
          name: "",
          studio: "",
          producer: "",
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
          gridTemplateColumns: { xs: "1fr", sm: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          {loading && <CircularProgress />}
          {!loading && !error && (
            <Box sx={{ width: "100%" }}>
              <Typography>Producers</Typography>
              <Select
                labelId="producers-select-label"
                id="producers-simple-select"
                // value={producer}
                // onChange={handleChangeProducer}
                label="Producers"
                value={formik.values.producer}
                onChange={formik.handleChange("producer")}
                sx={{ width: "100%" }}
              >
                {response?.map((producer) => (
                  <MenuItem key={`producer${producer.id}`} value={producer.id}>
                    {producer.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {studios.loading && <CircularProgress />}
          {!studios.loading && !studios.error && (
            <Box sx={{ width: "100%" }}>
              <Typography>Studios</Typography>
              <Select
                labelId="studios-select-label"
                id="studios-simple-select"
                // value={studio}
                // onChange={handleChangeStudio}
                label="Studios"
                value={formik.values.studio}
                onChange={formik.handleChange("studio")}
                sx={{ width: "100%" }}
              >
                {studios.response?.map((studioItem) => (
                  <MenuItem
                    key={`studio${studioItem.id}`}
                    value={studioItem.id}
                  >
                    {studioItem.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Box>
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
      </Box>
    </Box>
  );
}
