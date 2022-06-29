import styles from "./Nav.module.scss";
import { LoginContext } from "../../Contexts/LoginContext";
import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router";
import { ShowContentContext } from "../../Contexts/ShowContentContext";
import { ShowModalContext } from "../../Contexts/ShowModalContext";
const Nav = () => {
  const history = useHistory();
  const { burger, setBurger } = useContext(LoginContext);
  const { content, setContent } = useContext(ShowContentContext);
  const { showModal, setShowModal } = useContext(ShowModalContext);

  return (
    <div className={burger ? `${styles.show}` : `${styles.wrap}`}>
      <ul>
        <li className={styles.user}>
          <i class="far fa-user"></i>
        </li>
        <li
          onClick={() => {
            history.push("/dashboard");
            setBurger(false);
            setContent("main");
            setShowModal(false);
          }}
        >
          Panel
        </li>
        <li
          onClick={() => {
            history.push("/dashboard/settings");
            setBurger(false);
            setContent("settings");
            setShowModal(false);
          }}
        >
          Ustawienia
        </li>
        <li
          onClick={() => {
            history.push("/dashboard/stats");
            setBurger(false);
            setContent("stats");
            setShowModal(false);
          }}
        >
          Statystyki
        </li>
        <li
          onClick={() => {
            history.push("/dashboard/cyclic_actions");
            setBurger(false);
            setContent("cyclic");
            setShowModal(false);
          }}
        >
          Cykliczne akcje
        </li>
        <li
          onClick={() => {
            history.push("/dashboard/all_actions");
            setBurger(false);
            setContent("all");
            setShowModal(false);
          }}
        >
          Wszystkie akcje
        </li>
        <li
          onClick={() => {
            history.push("/dashboard/debtors");
            setBurger(false);
            setContent("debtors");
            setShowModal(false);
          }}
        >
          Lista dłużników
        </li>
      </ul>
    </div>
  );
};

export default Nav;
