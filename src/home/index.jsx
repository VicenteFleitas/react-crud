import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// components
import { ContactTable } from "../components/contact-table";
import { ContactFormModal } from "../components/contact-form-modal";

// hooks
// import useAxios from "../hooks/useAxios";
import useFetch from "../hooks/useFetch";

export default function Home() {
  const navigate = useNavigate();
  const { fetchData, loading, response, error, statusCode } = useFetch();
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    if (response && !error && !loading) {
      if (statusCode === 201) {
        console.log(response);
        setContacts([
          {
            id: response.id,
            name: response.name,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
          },
          ...contacts,
        ]);
      } else if (Array.isArray(response) && !editingContact)
        setContacts(response);
    }
  }, [response]);

  useEffect(() => {
    if (statusCode === 401) {
      // redirect
      navigate("oauth2");
    }
  }, [error]);

  useEffect(() => {
    // fetch data
    fetchData({
      url: "/v1/movies/list",
      method: "GET",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    });
  }, []);

  const handleAddContact = (contact) => {
    if (editingContact) {
      let data = {
        name: contact.name,
        producers: [
          {
            id: contact.producer.toString(),
          },
        ],
        studios: [
          {
            id: contact.studio.toString(),
          },
        ],
      };

      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${window.localStorage.getItem("access_token")}`
      );
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(data);

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`https://cloud.romapy.com/v1/movies/${contact.id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          fetchData({
            url: "/v1/movies/list",
            method: "GET",
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(
                "access_token"
              )}`,
            },
          });
        })
        .catch((error) => console.log("error", error));
    } else {
      let uuid = crypto.randomUUID();
      let data = {
        requestUUID: uuid,
        name: contact.name,
        producers: [
          {
            requestUUID: uuid,
            id: contact.producer,
          },
        ],
        studios: [
          {
            requestUUID: uuid,
            id: contact.studio,
          },
        ],
      };

      fetchData({
        url: "/v1/movies",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem(
            "access_token"
          )}`,
        },
      });
    }
    handleCloseModal();
  };

  const handleDeleteContact = (id) => {
    fetchData({
      url: `/v1/movies/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    });
    if (!error && !loading)
      setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const handleOpenModal = (contact) => {
    if (contact) {
      contact = { ...contact, producer: "", studio: "" };
      setEditingContact(contact);
    } else {
      setEditingContact(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  return (
    <Box sx={{ margin: 2 }}>
      <main className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Movies</h1>
          {error && statusCode !== 204 && (
            <Box
              bgcolor="warning.main"
              sx={{
                borderRadius: 1,
                padding: 1,
                marginBottom: 1,
                color: "white",
              }}
            >
              <Typography sx={{ fontWeight: 900, textAlign: "center" }}>
                {error}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ marginBottom: 2 }}
          >
            Agregar
          </Button>
        </div>

        {loading && <CircularProgress />}

        <ContactTable
          contacts={contacts}
          onDelete={handleDeleteContact}
          onAddEdit={handleOpenModal}
        />

        <ContactFormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddContact}
          initialValues={editingContact || undefined}
        />
      </main>
    </Box>
  );
}
