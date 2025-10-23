"use client";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function ContactForm() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [error, setError] = useState({ name: false, email: false, message: false });
  const [success, setSuccess] = useState(false);

  const form = useRef<HTMLFormElement>(null);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Move validation logic into useEffect to avoid state updates during render
  useEffect(() => {
    const newError = { ...error };
    let hasChanges = false;

    if (error.email && isValidEmail(contactEmail)) {
      newError.email = false;
      hasChanges = true;
    }
    if (error.name && contactName) {
      newError.name = false;
      hasChanges = true;
    }
    if (error.message && contactMessage) {
      newError.message = false;
      hasChanges = true;
    }

    if (hasChanges) {
      setError(newError);
    }
  }, [contactEmail, contactName, contactMessage, error.email, error.name, error.message, error]);

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
          error={error.name}
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
          error={error.email || (contactEmail !== "" && !isValidEmail(contactEmail))}
          helperText={error.email && "Please enter a valid email"}
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
          error={error.message}
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
