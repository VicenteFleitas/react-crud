import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

// components
import { ContactTable } from "../components/contact-table";
import { ContactFormModal } from "../components/contact-form-modal";

// hooks
import useAxios from "../hooks/useAxios";

export default function Home() {
  const { fetchData, loading, response, error, statusCode } = useAxios();
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    if (response && !error && !loading) {
      console.log(statusCode);
      if (statusCode === 201) setContacts([...contacts, response]);
      else if (Array.isArray(response)) setContacts(response);
    }
  }, [response]);

  useEffect(() => {
    fetchData({
      url: "/api/contacts",
      method: "GET",
    });
  }, []);

  const handleAddContact = (contact) => {
    if (editingContact) {
      fetchData({
        url: `/api/contacts/${contact.id}`,
        method: "PUT",
        data: contact,
      });
      if (!error && !loading)
        setContacts(contacts.map((c) => (c.id === contact.id ? contact : c)));
    } else {
      fetchData({
        url: "/api/contacts",
        method: "POST",
        data: contact,
      });
    }
    handleCloseModal();
  };

  const handleDeleteContact = (id) => {
    fetchData({
      url: `/api/contacts/${id}`,
      method: "DELETE",
    });
    if (!error && !loading)
      setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const handleOpenModal = (contact) => {
    if (contact) {
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
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Titulo</h1>
        {error && (
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
              {error.message}
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
  );
}
