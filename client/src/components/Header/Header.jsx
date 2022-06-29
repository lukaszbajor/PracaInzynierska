import styles from "./Header.module.scss";
import LogReg from "../LogReg/LogReg";

import { ShowModalContext } from "../../Contexts/ShowModalContext";
import { useHistory } from "react-router";
import { useContext } from "react";
import { LoginContext } from "../../Contexts/LoginContext";

const Header = () => {
  const { showModal, setShowModal, texts, idx } = useContext(ShowModalContext);
  const handleBurger = () => {
    setBurger(!burger);
    setShowModal(false);
  };
  const drawText = () => {
    let idx = Math.floor(Math.random() * texts.length);
    setShowModal(true);
  };
  const history = useHistory();
  const { isLoggedIn, burger, setBurger } = useContext(LoginContext);
  return (
    <div className={styles.wrap}>
      {isLoggedIn ? (
        <div
          onClick={() => {
            history.push("/dashboard");
            setBurger(false);
          }}
        >
          <div className={styles.logo}>
            <i class="fas fa-wallet"></i>
            <p>my_money</p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            history.push("/");
          }}
        >
          <div className={styles.logo}>
            <i class="fas fa-wallet"></i>

            <p>my_money</p>
          </div>
        </div>
      )}
      <div className={styles.right_panel}>
        {isLoggedIn ? (
          <div className={styles.drawMenuBox}>
            <button className={styles.draw} onClick={drawText}>
              Losuj cytat!
            </button>
            <i
              className={
                burger
                  ? `fas fa-chevron-up ${styles.update}`
                  : `fas fa-chevron-up ${styles.arrow}`
              }
              onClick={handleBurger}
            ></i>
          </div>
        ) : (
          <LogReg />
        )}
      </div>
    </div>
  );
};

export default Header;
