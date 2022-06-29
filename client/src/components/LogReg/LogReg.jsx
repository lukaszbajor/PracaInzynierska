import styles from "./LogReg.module.scss";

import { useHistory } from "react-router";
const LogReg = () => {
  const history = useHistory();
  const loginPath = () => {
    history.push("/login");
  };
  const registerPath = () => {
    history.push("/register");
  };

  return (
    <>
      <button onClick={loginPath} className={styles.log}>
        Zaloguj się
      </button>
      <button onClick={registerPath} className={styles.reg}>
        Zarejestruj się
      </button>
    </>
  );
};

export default LogReg;
