import styles from "./LoginPanel.module.scss";
import { useState, useContext } from "react";
import { useHistory } from "react-router";
import { LoginContext } from "../../Contexts/LoginContext";

const LoginPanel = ({ loginUser, returnHome }) => {
  const history = useHistory();
  const { setIsLoggedIn } = useContext(LoginContext);
  const [userLog, setUserLog] = useState("");
  const [userpassLog, setUserpassLog] = useState("");
  const login = (e) => {
    e.preventDefault();
    loginUser(userLog, userpassLog, onSuccess);
    function onSuccess() {
      setIsLoggedIn(true);
      history.push("/dashboard");
    }
  };

  return (
    <>
      <h1 className={styles.header}>Zaloguj się</h1>
      <div className={styles.wrap}>
        <form className={styles.form} onSubmit={login}>
          <div>
            <label htmlFor="login">Login:</label>
            <br />
            <input
              type="text"
              id="login"
              onChange={(e) => {
                setUserLog(e.target.value);
              }}
              required
              className={styles.log}
            />
            <br />
            <label htmlFor="pass">Hasło: </label>
            <br />
            <input
              type="password"
              id="pass"
              onChange={(e) => {
                setUserpassLog(e.target.value);
              }}
              required
              className={styles.pass}
            />
            <br />
          </div>
          <div className={styles.btns}>
            <input type="submit" value="Zaloguj się" />
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

export default LoginPanel;
