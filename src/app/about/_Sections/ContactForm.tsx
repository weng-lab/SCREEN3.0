"use client";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Box, Button, TextField, Typography } from "@mui/material";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactForm() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [error, setError] = useState({ name: false, email: false, message: false });
  const [success, setSuccess] = useState(false);

  const form = useRef<HTMLFormElement>(null);

  // `error` records which fields failed the last submit. Whether a failure is still worth showing
  // depends on the field's current value, so it is derived during render rather than synced by an
  // effect (which would re-render the whole form on every keystroke that fixes a field).
  const showError = {
    name: error.name && !contactName,
    email: error.email && !isValidEmail(contactEmail),
    message: error.message && !contactMessage,
  };

  const handleSubmit = async () => {
    const newErrorState = {
      name: !contactName,
      email: !isValidEmail(contactEmail),
      message: !contactMessage,
    };

    if (!newErrorState.name && !newErrorState.email && !newErrorState.message) {
      try {
        await emailjs.sendForm("service_k7xidgk", "template_15g5s3y", form.current!, "VU9U1vX9cAro8XtUK");
        setContactName("");
        setContactEmail("");
        setContactMessage("");
        setSuccess(true);
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again later.");
      }
    }

    setError(newErrorState);
  };

  return (
    <>
      <Box
        component="form"
        ref={form}
        id="contact-us"
        sx={{
          "& > :not(style)": { width: "50ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          value={contactName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setContactName(event.target.value);
          }}
          error={showError.name}
          name="user_name"
          type="text"
          sx={{ display: "block", mb: 1 }}
          id="outlined-basic"
          label="Name"
          variant="outlined"
        />
        <TextField
          required
          value={contactEmail}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setContactEmail(event.target.value);
          }}
          error={showError.email || (contactEmail !== "" && !isValidEmail(contactEmail))}
          helperText={showError.email && "Please enter a valid email"}
          name="user_email"
          type="email"
          sx={{ display: "block", mb: 1 }}
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <TextField
          required
          value={contactMessage}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setContactMessage(event.target.value);
          }}
          error={showError.message}
          name="message"
          type="text"
          fullWidth
          rows={4}
          sx={{ display: "block" }}
          multiline
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <Button sx={{ mt: 1 }} variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      {success && <Typography>Submitted successfully, thank you!</Typography>}
    </>
  );
}
