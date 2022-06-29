import { useState } from "react";
import { useHistory } from "react-router";
import styles from "./RegistrationPanel.module.scss";

const RegistrationPanel = ({ registerUser }) => {
  const history = useHistory();
  const [usernameReg, setUsernameReg] = useState("");
  const [userloginReg, setUserloginReg] = useState("");
  const [userpassReg, setUserpassReg] = useState("");
  const [userpass2Reg, setUserpass2Reg] = useState("");
  const [useremailReg, setUseremailReg] = useState("");
  const [userSexReg, setSexReg] = useState("");
  const [userSavingReg, setUserSavingReg] = useState(0);
  const [userCurrentBalanceReg, setUserCurrentBalanceReg] = useState(0);

  const register = (e) => {
    e.preventDefault();
    registerUser(
      usernameReg,
      userloginReg,
      userpassReg,
      userpass2Reg,
      useremailReg,
      userSexReg,
      userSavingReg,
      userCurrentBalanceReg,
      onSuccess
    );
  };
  function onSuccess() {
    history.push("/login");
  }

  return (
    <>
      <h1 className={styles.header}>Zarejestruj się</h1>
      <div className={styles.wrap}>
        <form className={styles.form} onSubmit={register}>
          <div>
            <label htmlFor="name">Podaj imię:</label>
            <br />
            <input
              type="text"
              id="name"
              onChange={(e) => {
                setUsernameReg(e.target.value);
              }}
              required
              className={styles.log}
            />
            <br />
            <label htmlFor="login">Podaj login:</label>
            <br />
            <input
              type="text"
              id="login"
              onChange={(e) => {
                setUserloginReg(e.target.value);
              }}
              required
              className={styles.log}
            />
            <br />
            <label htmlFor="pass">Podaj hasło: </label>
            <br />
            <input
              type="password"
              id="pass"
              onChange={(e) => {
                setUserpassReg(e.target.value);
              }}
              required
              className={styles.log}
            />
            <br />
            <label htmlFor="pass2">Powtórz hasło: </label>
            <br />
            <input
              type="password"
              id="pass2"
              onChange={(e) => {
                setUserpass2Reg(e.target.value);
              }}
              required
              className={styles.log}
            />
            <br />
            <label htmlFor="email">Podaj e-mail: </label>
            <br />
            <input
              type="email"
              id="email"
              onChange={(e) => {
                setUseremailReg(e.target.value);
              }}
              required
              className={styles.log}
            />
            <br />
            <div className={styles.radioBox}>
              <label htmlFor="sex">Płeć: </label>
              M:
              <input
                type="radio"
                id="sex"
                name="sex"
                onChange={(e) => {
                  setSexReg(e.target.value);
                }}
                value="m"
                required
              />
              K:
              <input
                type="radio"
                id="sex"
                name="sex"
                onChange={(e) => {
                  setSexReg(e.target.value);
                }}
                value="k"
                required
              />
            </div>
            <br />
            <label htmlFor="saving" className={styles.sav}>
              Odłożone pieniądze:{" "}
            </label>
            <br />
            <input
              type="number"
              id="saving"
              step="0.01"
              onChange={(e) => {
                setUserSavingReg(Number(e.target.value));
              }}
              required
              className={styles.log}
            />
            <br />
            <label htmlFor="currentBalance">Aktualny stan konta: </label>
            <br />
            <input
              type="number"
              id="currentBalance"
              step="0.01"
              onChange={(e) => {
                setUserCurrentBalanceReg(Number(e.target.value));
              }}
              required
              className={styles.log}
            />
          </div>
          <div className={styles.btns}>
            <input type="submit" value="Zarejestruj się" />
            <input type="reset" value="Wyczyść" />
          </div>
        </form>
        <p
          onClick={() => {
            history.push("/");
          }}
          className={styles.back}
        >
          Wróć do strony głównej.
        </p>
      </div>
    </>
  );
};

export default RegistrationPanel;
