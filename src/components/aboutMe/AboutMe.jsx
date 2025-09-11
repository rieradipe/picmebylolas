import styles from "./AboutMe.module.css";

export default function AboutMe() {
  return (
    <section className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.title}>
        Sobre mí
      </h2>

      <p className={styles.pitch}>
        👋 Soy <b>RieraDipe</b>, desarrolladora <b>full-stack</b> con pasión por
        crear productos <b>claros, seguros y fáciles de usar</b>. Trabajo con
        mentalidad ágil: iterar rápido, aprender del feedback y mejorar
        continuamente.
      </p>

      <ul className={styles.list}>
        <li>💡 Curiosidad constante</li>
        <li>🧭 Pragmatismo y foco en el valor</li>
        <li>🤝 Colaboración y trabajo en equipo</li>
        <li>⚡ Adaptabilidad ante cambios</li>
        <li>🌱 Aprendizaje continuo</li>
      </ul>
    </section>
  );
}
