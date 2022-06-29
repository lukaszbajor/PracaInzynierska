import styles from "./Dashboard.module.scss";
import AddAction from "./AddAction/AddAction";
import LastActions from "./LastActions/LastActions";
import Balance from "./Balance/Balance";
import Nav from "../Nav/Nav";
import UserSettings from "../UserSettings/UserSettings";
import Stats from "../Stats/Stats";
import CyclicActions from "../CyclicActions/CyclicActions";
import AllActions from "../AllActions/AllActions";
import Debtors from "../Debtors/Debtors";
import Axios from "axios";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../Contexts/LoginContext";
import { ShowContentContext } from "../../Contexts/ShowContentContext";
import { BalanceContext } from "../../Contexts/BalanceContext";
import { ShowModalContext } from "../../Contexts/ShowModalContext";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
const Dashboard = () => {
  Axios.defaults.withCredentials = true;

  const [loginStatus, setLoginStatus] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [userSavings, setUserSavings] = useState(0);
  const [userId, setUserId] = useState(0);
  const [content, setContent] = useState("main");
  const { isLoggedIn, setIsLoggedIn, burger, setBurger } =
    useContext(LoginContext);
  const [inc, setInc] = useState([]);
  const [exp, setExp] = useState([]);
  const [allDebtors, setAllDebtors] = useState([]);
  const { showModal, setShowModal, texts, idx } = useContext(ShowModalContext);

  const getData = () => {
    Axios.get("http://localhost:3000/allincomes").then((response) => {
      setInc(response.data);
    });
    Axios.get("http://localhost:3000/allexpenses").then((response) => {
      setExp(response.data);
      console.log(exp);
    });
    Axios.get("http://localhost:3000/alldebtors").then((response) => {
      setAllDebtors(response.data);
      console.log(allDebtors);
    });
  };

  const closeDraw = () => {
    setShowModal(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const history = useHistory();

  useEffect(() => {
    Axios.get("http://localhost:3000/login").then((response) => {
      if (response.data.loggedIn == true) {
        setIsLoggedIn(true);
        setLoginStatus(response.data.userData.name);
        setUserBalance(response.data.userData.current_balance);
        setUserSavings(response.data.userData.savings);
        setUserId(response.data.userData.id);
      }
    });
  }, []);
  const logout = () => {
    Axios.get("http://localhost:3000/logout").then((response) => {
      history.push("/login");
      toast.success(response.data);
      setIsLoggedIn(false);
      setBurger(false);
    });
  };

  return (
    <>
      {isLoggedIn ? (
        <div className={styles.dashboard}>
          <div className={styles.firstPanel}>
            <div className={styles.logged}>
              <p>Witaj, {loginStatus}!</p>
              <button onClick={logout} className={styles.btn}>
                Wyloguj
              </button>
            </div>
            <div className={styles.moneyInfo}>
              <p> Twoje odłożone pieniądze: {userSavings.toFixed(2)}</p>
              <p className={styles.balance}>
                Aktuany stan konta: {userBalance.toFixed(2)}
              </p>
            </div>
          </div>
          {content === "main" ? (
            <h2 className={styles.titleInfo}>Panel użytkownika</h2>
          ) : (
            ""
          )}
          {content === "settings" ? (
            <h2 className={styles.titleInfo}>Ustawienia</h2>
          ) : (
            ""
          )}
          {content === "stats" ? (
            <h2 className={styles.titleInfo}>Statystyki</h2>
          ) : (
            ""
          )}
          {content === "cyclic" ? (
            <h2 className={styles.titleInfo}>Cykliczne akcje</h2>
          ) : (
            ""
          )}
          {content === "all" ? (
            <h2 className={styles.titleInfo}>Wszystkie akcje</h2>
          ) : (
            ""
          )}
          {content === "debtors" ? (
            <h2 className={styles.titleInfo}>Lista dłużników</h2>
          ) : (
            ""
          )}

          <div className={styles.secondPanel}>
            {content === "main" ? (
              <BalanceContext.Provider
                value={{
                  userBalance,
                  setUserBalance,
                  userSavings,
                  setUserSavings,
                }}
              >
                <ShowContentContext.Provider value={{ content, setContent }}>
                  <AddAction userId={userId} getData={getData} />
                  <Balance />
                  <LastActions userId={userId} inc={inc} exp={exp} />
                </ShowContentContext.Provider>
              </BalanceContext.Provider>
            ) : (
              <>
                <ShowContentContext.Provider value={{ content, setContent }}>
                  <BalanceContext.Provider
                    value={{
                      userBalance,
                      setUserBalance,
                      userSavings,
                      setUserSavings,
                    }}
                  >
                    {content === "settings" ? (
                      <UserSettings userId={userId} />
                    ) : (
                      ""
                    )}
                    {content === "stats" ? <Stats userId={userId} /> : ""}
                    {content === "cyclic" ? (
                      <CyclicActions
                        userId={userId}
                        getData={getData}
                        inc={inc}
                        exp={exp}
                      />
                    ) : (
                      ""
                    )}
                    {content === "all" ? (
                      <AllActions
                        userId={userId}
                        inc={inc}
                        exp={exp}
                        getData={getData}
                      />
                    ) : (
                      ""
                    )}
                    {content === "debtors" ? (
                      <Debtors
                        userId={userId}
                        getData={getData}
                        allDebtors={allDebtors}
                      />
                    ) : (
                      ""
                    )}
                  </BalanceContext.Provider>
                </ShowContentContext.Provider>
              </>
            )}
            <ShowContentContext.Provider value={{ content, setContent }}>
              <Nav />
            </ShowContentContext.Provider>
            {showModal ? (
              <div className={styles.modal}>
                <div className={styles.close} onClick={closeDraw}>
                  <i class="far fa-times-circle"></i>
                </div>
                <p className={styles.text}>{texts[idx].text}</p>
                <p className={styles.author}>{texts[idx].name}</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className={styles.infoLogin}>
            Musisz się zalogować aby korzystać z serwisu. Przejdź na
            stronę&nbsp;
            <span
              onClick={() => {
                history.push("/login");
              }}
            >
              logowania
            </span>
          </p>
          <i class={`${styles.lock} fas fa-lock`}></i>
        </div>
      )}
    </>
  );
};
export default Dashboard;
