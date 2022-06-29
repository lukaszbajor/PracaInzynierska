import "./App.css";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import RegistrationPanel from "./components/RegistrationPanel/RegistrationPanel";
import LoginPanel from "./components/LoginPanel/LoginPanel";
import Header from "./components/Header/Header";
import { LoginContext } from "./Contexts/LoginContext";
import { ShowModalContext } from "./Contexts/ShowModalContext";
import Axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

function App() {
  Axios.defaults.withCredentials = true;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [burger, setBurger] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const texts = [
    {
      name: "Robert T. Kiyoski",
      text: "Większość ludzi nigdy nie wzbogaca się, ponieważ nie są wyszkoleni pod kątem finansowym w taki sposób, by zauważyć okazje pojawiające się przed nimi.",
    },
    {
      name: "Warren Buffet",
      text: "Nie oszczędzaj tego, co zostaje po wszystkich wydatkach, lecz wydawaj, co zostaje po odłożeniu oszczędności.",
    },
    {
      name: "Benjamin Franklin",
      text: "Mało, często powtarzane, stanowi wiele. Strzeżcie się drobnych wydatków - Dość jest dla wody małego otworu, by wielki zatopiła okręt.",
    },
    {
      name: "Lois Frankel",
      text: "To nie pieniądze dają szczęście, ale to co dzięki nim można zrobić ze swoim życiem.",
    },
    {
      name: "Andrzej Majewski",
      text: "Człowiek biedny ceni sobie każdą złotówkę, bogaty każdy grosz.",
    },
    {
      name: "Brian Tracy",
      text: "Oszczędzaj i inwestuj dla zysku połowę każdej podwyżki dochodów lub wynagrodzenia aż do końca zawodowej kariery.",
    },
    {
      name: "Arystoteles",
      text: "Jesteśmy tym, co w swoim życiu powtarzamy. Doskonałość nie jest jednorazowym aktem, lecz nawykiem.",
    },
    {
      name: "Woody Allen",
      text: "Łatwiej jest wydać 2 dolary, niż zaoszczędzić jednego.",
    },
  ];
  let idx = Math.floor(Math.random() * texts.length);

  const registerUser = (
    usernameReg,
    userloginReg,
    userpassReg,
    userpass2Reg,
    useremailReg,
    userSexReg,
    userSavingReg,
    userCurrentBalanceReg,
    onSuccess
  ) => {
    Axios.post("http://localhost:3000/register", {
      name: usernameReg,
      login: userloginReg,
      pass: userpassReg,
      pass2: userpass2Reg,
      email: useremailReg,
      sex: userSexReg,
      savings: userSavingReg,
      current_balance: userCurrentBalanceReg,
    })
      .then((response) => {
        onSuccess();
        toast.success("Rejestracja poprawna!");
        console.log(response.statusText);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const loginUser = (userLog, userpassLog, onSuccess) => {
    Axios.post("http://localhost:3000/login", {
      login: userLog,
      pass: userpassLog,
    })
      .then((response) => {
        onSuccess();
        toast.success("Pomyślnie zalogowano!");
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  useEffect(() => {
    Axios.get("http://localhost:3000/login").then((response) => {
      console.log(response);
    });
  }, []);

  return (
    <>
      <Router>
        <>
          <Switch>
            <LoginContext.Provider
              value={{ isLoggedIn, setIsLoggedIn, burger, setBurger }}
            >
              <ShowModalContext.Provider
                value={{ showModal, setShowModal, texts, idx }}
              >
                <Header showModal={showModal} />

                <Route exact path="/" component={Home} />
                <Route path="/register">
                  <RegistrationPanel registerUser={registerUser} />
                </Route>
                <Route path="/login">
                  <LoginPanel loginUser={loginUser} />
                </Route>
                <Route path="/dashboard">
                  <Dashboard showModal={showModal} />
                </Route>
              </ShowModalContext.Provider>
            </LoginContext.Provider>
          </Switch>
          <ToastContainer position="bottom-left" />
        </>
      </Router>
    </>
  );
}

export default App;
