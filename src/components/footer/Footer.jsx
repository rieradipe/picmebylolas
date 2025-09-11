import React from "react";
import styles from "./Footer.module.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.socials}>
        <a
          href="https://github.com/rieradipe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visita mi perfil GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/rieradipe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visita mi LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="mailto:rieradipe@Gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Correo electrónico"
        >
          <FaEnvelope />
        </a>
      </div>

      <div className={styles.copy}>
        &copy; 2025 PickmeByLolas. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
