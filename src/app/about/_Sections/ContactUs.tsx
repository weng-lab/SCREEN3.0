import { Box, Link, Typography } from "@mui/material";
import ContactForm from "../contactForm";
import { AboutSection } from "./AboutSection";

export default function ContactUs() {
  return (
    <AboutSection id="contact-us" title="Contact Us">
      <Typography variant="body1">Send us a message and we&apos;ll be in touch!</Typography>
      <Typography variant="body1">
        We greatly appreciate any feedback you may have. Knowing how our users are using the site and documenting issues
        they may have are important to make this resource better and easier to use.
      </Typography>
      <Typography variant="body1">
        If you&apos;re experiencing an error/bug, feel free to{" "}
        <Link href="https://github.com/weng-lab/SCREEN3.0/issues" target="_blank" rel="noopener noreferrer">
          submit an issue on Github.
        </Link>
      </Typography>
      <Typography variant="body1">
        If you would like to send an attachment, feel free to email us directly at&nbsp;
        <Link href="mailto:encode-screen@googlegroups.com" target="_blank" rel="noopener noreferrer">
          encode&#8209;screen@googlegroups.com
        </Link>
      </Typography>
      <Box pt={1}>
        <ContactForm />
      </Box>
    </AboutSection>
  );
}
