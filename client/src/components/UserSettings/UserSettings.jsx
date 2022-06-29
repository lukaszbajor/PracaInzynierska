import { useState, useContext } from "react";
import { useHistory } from "react-router";
import { ShowContentContext } from "../../Contexts/ShowContentContext";

import styles from "./UserSettings.module.scss";
import useLocalStorage from "../../hooks/useLocalStorage";
import Axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSettings = ({ userId }) => {
  const history = useHistory();
  const { content, setContent } = useContext(ShowContentContext);

  const [theme, setTheme] = useLocalStorage("theme", false);
  const body = document.body;
  const [checked, setChecked] = useLocalStorage("checked", false);

  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  console.log(theme);

  const changePass = (e) => {
    e.preventDefault();
    Axios.put("http://localhost:3000/changepass", {
      id: Number(userId),
      pass: pass,
      pass2: pass2,
    })
      .then((response) => {
        toast.success("Zmieniono hasło!");
      })
      .catch((err) => {
        toast.error("Hasła różnią się!");
      });
    e.target.reset();
  };

  return (
    <div className={styles.settings}>
      <button
        onClick={() => {
          history.push("/dashboard");
          setContent("main");
        }}
        className={styles.btn}
      >
        Wróć do panelu
      </button>
      <div className={styles.panel}>
        <label htmlFor="theme" className={styles.labelShow}>
          Tryb nocny
        </label>
        Włączony:
        <input
          type="checkbox"
          name="theme"
          onChange={() => {
            setChecked(!checked);
            setTheme(!theme);
            if (checked === true) {
              document.body.style.backgroundColor = "white";
              document.body.style.color = "black";
            } else {
              document.body.style.backgroundColor = "rgb(88, 84, 84)";
              document.body.style.color = "white";
            }
          }}
          checked={checked}
          className={styles.inpCheck}
        />
        <br />
        <label htmlFor="changePass" className={styles.labelShow}>
          Zmiana hasła
        </label>
        <form onSubmit={changePass} className={styles.form}>
          Wpisz nowe hasło:
          <input
            type="password"
            name="changePass"
            id=""
            className={styles.log}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <br />
          Powtórz nowe hasło:
          <input
            type="password"
            name="changePass"
            id="check"
            className={styles.log}
            onChange={(e) => {
              setPass2(e.target.value);
            }}
          />
          <input type="submit" className={styles.btn} value="Zmień" />
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
