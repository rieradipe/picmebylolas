import React, { useState, useEffect, useRef } from "react";
import styles from "./HomePage.module.css";

import i1 from "@/assets/images/i1.png";
import i2 from "@/assets/images/i2.png";
import i3 from "@/assets/images/i3.png";
import i4 from "@/assets/images/i4.png";
import i5 from "@/assets/images/i5.png";
import i6 from "@/assets/images/i6.png";
import i7 from "@/assets/images/i7.png";
import i8 from "@/assets/images/i8.png";
import i9 from "@/assets/images/i9.png";
import i10 from "@/assets/images/i10.png";
import i11 from "@/assets/images/i11.png";
import i12 from "@/assets/images/i12.png";
import i13 from "@/assets/images/i13.png";
import i14 from "@/assets/images/i14.png";
import i15 from "@/assets/images/i15.png";
import i16 from "@/assets/images/i16.png";
import i17 from "@/assets/images/i17.png";
import i18 from "@/assets/images/i18.png";
import i19 from "@/assets/images/i19.png";
import i20 from "@/assets/images/i20.png";
import i21 from "@/assets/images/i21.png";
import i22 from "@/assets/images/i22.png";
import i23 from "@/assets/images/i23.png";
import i24 from "@/assets/images/i24.png";
import i25 from "@/assets/images/i25.png";
import i26 from "@/assets/images/i26.png";
import i27 from "@/assets/images/i27.png";
import i28 from "@/assets/images/i28.png";
import i29 from "@/assets/images/i29.png";
import i30 from "@/assets/images/i30.png";
import i31 from "@/assets/images/i31.png";
import i32 from "@/assets/images/i32.png";
import i33 from "@/assets/images/i33.png";
import i34 from "@/assets/images/i34.png";
import i35 from "@/assets/images/i35.png";
import i36 from "@/assets/images/i36.png";
import i37 from "@/assets/images/i37.png";

//  Sobre mí
import AboutMe from "../../components/aboutMe/AboutMe.jsx";

const imagenes = {
  1: i1,
  2: i2,
  3: i3,
  4: i4,
  5: i5,
  6: i6,
  7: i7,
  8: i8,
  9: i9,
  10: i10,
  11: i11,
  12: i12,
  13: i13,
  14: i14,
  15: i15,
  16: i16,
  17: i17,
  18: i18,
  19: i19,
  20: i20,
  21: i21,
  22: i22,
  23: i23,
  24: i24,
  25: i25,
  26: i26,
  27: i27,
  28: i28,
  29: i29,
  30: i30,
  31: i31,
  32: i32,
  33: i33,
  34: i34,
  35: i35,
  36: i36,
  37: i37,
};

const actividades = [
  {
    id: 1,
    nombre: "Dron",
    alt: "Uno de nuestros Drones dispuesto a llevarte lo que necesites",
  },
  {
    id: 2,
    nombre: "WC",
    alt: "Uno de los baños públicos que tiene el recinto",
  },
  { id: 3, nombre: "WC", alt: "Obreros colocando nuestros baños públicos" },
  {
    id: 4,
    nombre: "Territorio Dron",
    alt: "Acceso de las personas y los drones con su correspondiente zona segura y firma de consentimiento",
  },
  {
    id: 5,
    nombre: "Escalada",
    alt: "Persona en la cima después de una experiencia escalando",
  },
  {
    id: 6,
    nombre: "Senderismo",
    alt: "Un par de personas haciendo nuestras rutas de senderismo",
  },
  {
    id: 7,
    nombre: "Senderismo",
    alt: "Personas haciendo fotos después de ver un paisaje increíble desde la ruta",
  },
  {
    id: 8,
    nombre: "Senderismo",
    alt: "Persona viendo una cascada en medio de la ruta de senderismo",
  },
  { id: 9, nombre: "Senderismo", alt: "Paisaje de una ruta de senderismo" },
  { id: 10, nombre: "Picnic", alt: "Mesas de picnic" },
  { id: 11, nombre: "Picnic", alt: "Mesas de picnic" },
  { id: 12, nombre: "Picnic", alt: "Mesas de picnic" },
  { id: 13, nombre: "Picnic", alt: "Mesas de picnic" },
  { id: 14, nombre: "Picnic", alt: "Mesas de picnic" },
  {
    id: 15,
    nombre: "WC",
    alt: "Uno de los baños públicos que tiene el recinto",
  },
  {
    id: 16,
    nombre: "Lago",
    alt: "Pequeñas cascadas naturales en nuestra zona de baño y recreo",
  },
  { id: 17, nombre: "Lago", alt: "Personas haciendo deporte con las canoas" },
  {
    id: 18,
    nombre: "Lago",
    alt: "Zona recreativa en el lago donde poder pegarse un chapuzón",
  },
  { id: 19, nombre: "Lago", alt: "Zona recreativa en el río" },
  {
    id: 20,
    nombre: "Lago",
    alt: "Zona de canoas para las actividades en el río o en el lago",
  },
  { id: 21, nombre: "Parque", alt: "Parque infantil, zona de juegos" },
  { id: 22, nombre: "Parque", alt: "Parque infantil, zona de juegos" },
  { id: 23, nombre: "Parque", alt: "Parque infantil, zona de juegos" },
  { id: 24, nombre: "Parque", alt: "Parque infantil, zona de juegos" },
  { id: 25, nombre: "Parque", alt: "Parque infantil, zona de juegos" },
  {
    id: 26,
    nombre: "Escalada",
    alt: "Persona haciendo escalada en nuestras montañas",
  },
  {
    id: 27,
    nombre: "Escalada",
    alt: "Persona haciendo escalada en nuestras montañas",
  },
  {
    id: 28,
    nombre: "WC",
    alt: "Uno de los baños públicos que tiene el recinto",
  },
  {
    id: 29,
    nombre: "WC",
    alt: "Uno de los baños públicos que tiene el recinto",
  },
  {
    id: 30,
    nombre: "Escalada",
    alt: "Imagen de nuestras montañas desde arriba",
  },
  {
    id: 31,
    nombre: "Senderismo",
    alt: "Imagen que muestra la dificultad de una de nuestras rutas",
  },
  {
    id: 32,
    nombre: "Senderismo",
    alt: "Imagen que muestra la dificultad de una de nuestras rutas",
  },
  {
    id: 33,
    nombre: "Senderismo",
    alt: "Imagen que muestra la dificultad de una de nuestras rutas",
  },
  {
    id: 34,
    nombre: "Caballo",
    alt: "Imagen de dos de nuestros caballos entrando al rancho",
  },
  {
    id: 35,
    nombre: "Caballos",
    alt: "Excursiones con nuestros amigos los caballos",
  },
  {
    id: 36,
    nombre: "Caballos",
    alt: "Excursiones con nuestros amigos los caballos",
  },
  {
    id: 37,
    nombre: "Caballos",
    alt: "Excursiones con nuestros amigos los caballos",
  },
];

const HomePage = () => {
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [paused, setPaused] = useState(false);
  const hoverRef = useRef(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(5);
      else if (window.innerWidth >= 768) setItemsPerView(3);
      else setItemsPerView(1);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // 👇 autoplay más suave: 1 en 1 y a 5s; pausa en hover
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % actividades.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  const visibleImages = Array.from({ length: itemsPerView }, (_, i) => {
    const idx = (index + i) % actividades.length;
    return actividades[idx];
  });

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Explora nuestros servicios</h1>
      <p className={styles.description}>
        PickMe By Lolas es una app para pedir comida, artículos de higiene y
        ayuda de forma segura, entregada por drones en zonas rurales y de
        difícil acceso.
      </p>

      <div
        className={styles.carousel}
        ref={hoverRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {visibleImages.map((actividad) => (
          <div
            key={`${actividad.id}-${index}`}
            className={`${styles.card} ${styles.show}`}
          >
            <img src={imagenes[actividad.id]} alt={actividad.alt} />
          </div>
        ))}
      </div>

      <AboutMe />
    </main>
  );
};

export default HomePage;
