import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./lib/theme.js";

import Home from "./home";
import Login from "./login";
import Oauth from "./oauth";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="callback" element={<Login />} />
        <Route path="oauth2" element={<Oauth />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
