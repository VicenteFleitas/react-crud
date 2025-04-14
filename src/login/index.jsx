import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

import { findGetParameter } from "../lib/utils.js";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const code = findGetParameter("code"); //resp.code;

    const authorizationValue =
      "Basic " +
      btoa(
        import.meta.env.VITE_CLIENT_ID + ":" + import.meta.env.VITE_CLIENT_PASS
      );

    var myHeaders = new Headers();
    myHeaders.append("Authorization", authorizationValue);

    var formdata = new FormData();
    formdata.append("grant_type", "authorization_code");
    formdata.append("code", code);
    formdata.append("redirect_uri", "https://localhost:3000/callback");
    formdata.append(
      "code_verifier",
      window.sessionStorage.getItem("pkce_code_verifier")
    );

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://cloud.romapy.com/oauth2/token", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        window.localStorage.setItem("access_token", result.access_token);
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      {error && <Typography>{JSON.stringify(error)}</Typography>}
      {loading && <CircularProgress />}
    </Box>
  );
};

export default Login;
