"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import emailjs from "@emailjs/browser";

export default function About() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [error, setError] = useState({ name: false, email: false, message: false });
  const [success, setSuccess] = useState(false);

  const form = useRef<HTMLFormElement>(null);

  function isValidEmail(email: string): boolean {
    //hopefully this is right, got it from ChatGPT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
  }, [contactEmail, contactName, contactMessage, error.email, error.name, error.message]);

  const handleSubmit = async () => {
    //Check fields to see if valid
    const newErrorState = { name: false, email: false, message: false };
    if (!contactName) newErrorState.name = true;
    if (!isValidEmail(contactEmail)) newErrorState.email = true;
    if (!contactMessage) newErrorState.message = true;

    //If all fields valid: Try to send email and form fields, catch any error
    if (!newErrorState.name && !newErrorState.email && !newErrorState.message) {
      try {
        await sendEmail();
        setContactName("");
        setContactEmail("");
        setContactMessage("");
        setSuccess(true);
      } catch (error) {
        console.error(error);
        window.alert("Something went wrong, please try again soon" + "\n" + JSON.stringify(error));
      }
    }
    setError(newErrorState);
  };

  const sendEmail = () => {
    return new Promise((resolve, reject) => {
      //These IDs come from the emailjs website (using screenumass gmail account)
      emailjs
        .sendForm("service_k7xidgk", "contactUs", form.current, "VU9U1vX9cAro8XtUK")
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <Grid2 container spacing={4} sx={{ maxWidth: "70%", mr: "auto", ml: "auto", mt: "3rem", mb: "3rem" }}>
      <Grid2 size={12}>
        <Typography paragraph variant="h3">
          About igSCREEN
        </Typography>
        <Typography paragraph variant="h5">
          Search <i>immune</i> Candidate cis-Regulatory Elements
        </Typography>
        <Typography paragraph>
          igSCREEN is a comprehensive catalog of multi-omic knowledge about human immune cells. It was designed and
          built by Dr. Zhiping Weng’s and Dr. Jill Moore’s labs at UMass Chan Medical School.
        </Typography>
        <Typography paragraph>
          For questions or comments please contact us at Zhiping.Weng@umassmed.edu and Jill.Moore@umassmed.edu
        </Typography>
        <Typography paragraph>This work is supported by U01AI173584.</Typography>
      </Grid2>
      {/* Contact Us */}
      <Grid2 id="contact-us" size={12}>
        <Typography mb={1} variant="h2">
          Contact Us
        </Typography>
        <Typography mb={1} variant="body1">
          Send us a message and we&apos;ll be in touch!
        </Typography>
        <Typography mb={1} variant="body1">
          As this is a beta site, we would greatly appreciate any feedback you may have. Knowing how our users are using
          the site and documenting issues they may have are important to make this resource better and easier to use.
        </Typography>
        <Box mb={1}>
          <Typography display={"inline"} variant="body1">
            If you&apos;re experiencing an error/bug, feel free to&nbsp;
          </Typography>
          <Link
            display={"inline"}
            href="https://github.com/weng-lab/igScreen/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            submit an issue on Github.
          </Link>
        </Box>
        <Box mb={2}>
          <Typography display={"inline"} variant="body1">
            If you would like to send an attachment, feel free to email us directly at&nbsp;
          </Typography>
          <Link
            display={"inline"}
            href="mailto:encode-screen@googlegroups.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            encode&#8209;screen@googlegroups.com
          </Link>
        </Box>
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
          <input style={{ display: "none" }} name="site" value={"igScreen"} readOnly></input>
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
      </Grid2>
    </Grid2>
  );
}
