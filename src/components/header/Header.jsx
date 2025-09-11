import React, { memo } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/images/pickmeLogo.png";
import Hamburger from "../hamburger/Hamburger";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { items = [] } = useCart();
  const count = Array.isArray(items)
    ? items.reduce((acc, i) => acc + (Number(i?.qty) || 0), 0)
    : 0;

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header className={styles.header}>
      <Link to="/" onClick={handleScrollTop} aria-label="Ir a inicio">
        <div className={styles.logoContainer}>
          <img
            src={logo}
            alt="Logo de PickMeByLolas"
            className={styles.logo}
            loading="eager"
          />
        </div>
      </Link>

      <h1 className={styles.titles}>PickMe By Lolas</h1>

      <div className={styles.rightSide}>
        <Link
          to="/cart"
          className={styles.cartLink}
          title="Ir al carrito"
          aria-label={`Carrito ${
            count > 0
              ? `con ${count} artículo${count === 1 ? "" : "s"}`
              : "vacío"
          }`}
        >
          <span className={styles.cartText}>Carrito</span>
          <span
            className={styles.badge}
            data-empty={count === 0}
            aria-live="polite"
            aria-atomic="true"
          >
            {count}
          </span>
        </Link>

        <Hamburger />
      </div>
    </header>
  );
};

export default memo(Header);
