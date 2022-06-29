import styles from "./Debtors.module.scss";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useContext } from "react";
import { LoginContext } from "../../Contexts/LoginContext";
import { ShowContentContext } from "../../Contexts/ShowContentContext";
import { BalanceContext } from "../../Contexts/BalanceContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Axios from "axios";

const Debtors = ({ userId, getData, allDebtors }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [date, setDate] = useState("");
  const [option, setOption] = useState("empty");
  const { userBalance, setUserBalance } = useContext(BalanceContext);
  const { content, setContent } = useContext(ShowContentContext);

  let allDebs = [...allDebtors];
  console.log(allDebs);
  const addDebtor = (e) => {
    e.preventDefault();
    console.log(allDebs);
    const url = `http://localhost:3000/adddebtor`;
    Axios.post(url, {
      name: name,
      value: value,
      date: date,
      id_user: userId,
    })
      .then((response) => {
        toast.success("Dodano dłużnika!");
        let newValue = userBalance + value;
        setUserBalance(newValue);

        Axios.put("http://localhost:3000/updatebalance", {
          id: Number(userId),
          current_balance: Number(newValue),
        })
          .then((response) => {
            getData();
          })
          .catch((err) => {
            toast.error(err);
          });
      })
      .catch((err) => {
        toast.error("Coś poszło nie tak!");
      });

    e.target.reset();
  };

  const deleteDebtor = (id) => {
    const url = `http://localhost:3000/`;

    allDebs.map((item) => {
      if (userId === item.id_user) {
        Axios.delete(`${url}deletedebtor/${id}`).then((response) => {
          getData();
          let newValue = userBalance - item.value;
          Axios.put("http://localhost:3000/updatebalance", {
            id: Number(userId),
            current_balance: Number(newValue),
          }).then((response) => {
            getData();
            setUserBalance(newValue);
          });
        });
      }
    });
    toast.success("Usunięto dłużnika!");
  };

  useEffect(() => {
    getData();
  }, []);

  let countAction = [];

  return (
    <div className={styles.wrap}>
      <button
        onClick={() => {
          history.push("/dashboard");
          setContent("main");
        }}
        className={`${styles.btnSec} back`}
      >
        Wróć do panelu
      </button>
      <div className={styles.box}>
        <form className={styles.addForm} onSubmit={addDebtor}>
          <h3 className={styles.infoPl}>Dodaj dłużnika</h3>

          <br />
          <label htmlFor="name" className={styles.labelMargin}>
            Dłużnik:
          </label>
          <input
            type="text"
            id="name"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
            className={styles.log}
          />
          <br />
          <label htmlFor="value" className={styles.labelMargin}>
            Kwota:
          </label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            onChange={(e) => {
              setValue(-e.target.value);
            }}
            className={styles.log}
          />
          <br />
          <label htmlFor="date">Data:</label>
          <input
            type="date"
            required
            onChange={(e) => {
              setDate(e.target.value);
            }}
            className={styles.date}
          />
          <br />
          <br />
          <div className={styles.btns}>
            <input type="submit" value="Dodaj" />
            <input type="reset" value="Wyczyść" />
          </div>
        </form>

        <div className={styles.lastActions}>
          <h3 className={styles.info}>Lista dłużników</h3>
          <div className={styles.panel}>
            {allDebs.map((item) => {
              if (item.id_user === userId) {
                countAction.push(item);
              }
            })}
            {allDebs
              .filter((item) => userId == item.id_user)
              .sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              })

              .map((item) => {
                countAction.push(item);

                return (
                  <div className={styles.oneAction} key={item.id}>
                    <p className={styles.name}>{item.name}</p>
                    <span className={styles.date}>
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span
                      className={
                        item.value < 0 ? `${styles.minus}` : `${styles.plus}`
                      }
                    >
                      {`${item.value.toFixed(2)} zł`}
                    </span>
                    <button
                      onClick={() => {
                        deleteDebtor(item.id);
                      }}
                      className={styles.btn}
                    >
                      Usuń
                    </button>
                  </div>
                );

                // }
              })}

            {countAction.length === 0 ? (
              <p className={styles.empty}>Brak dłużników!</p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debtors;
