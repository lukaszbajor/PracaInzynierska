import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { ShowContentContext } from "../../Contexts/ShowContentContext";
import { BalanceContext } from "../../Contexts/BalanceContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Axios from "axios";
import styles from "./AllActions.module.scss";
const AllActions = ({ userId, inc, exp, getData }) => {
  const { userBalance, setUserBalance } = useContext(BalanceContext);

  const history = useHistory();
  const { content, setContent } = useContext(ShowContentContext);
  const countAction = [];
  let allActions = [...inc, ...exp];

  const deleteAction = (id) => {
    const url = `http://localhost:3000/`;

    const income = allActions.filter(
      (item) => id === item.id && item.value > 0
    );
    const expense = allActions.filter(
      (item) => id === item.id && item.value < 0
    );
    if (income) {
      income.map((item) => {
        Axios.delete(`${url}deleteincome/${id}`).then((response) => {
          console.log("inc");
          let newValue = Number(userBalance) - Number(item.value);
          Axios.put("http://localhost:3000/updatebalance", {
            id: Number(userId),
            current_balance: Number(newValue),
          }).then((response) => {
            setUserBalance(newValue);
            getData();
          });
        });

        getData();
      });
    }
    if (expense) {
      expense.map((item) => {
        Axios.delete(`${url}deleteexpense/${id}`).then((response) => {
          getData();

          let newValue = Number(userBalance) - Number(item.value);
          Axios.put("http://localhost:3000/updatebalance", {
            id: Number(userId),
            current_balance: Number(newValue),
          }).then((response) => {
            setUserBalance(newValue);
            getData();
          });
        });
      });
      toast.success("Poprawnie usunięto");
    }


  };

  return (
    <div className={styles.wrap}>
      <button
        onClick={() => {
          history.push("/dashboard");
          setContent("main");
        }}
        className={styles.btn}
      >
        Wróć do panelu
      </button>

      <div className={styles.all}>
        <h3 className={styles.info}>Wszystkie Twoje akcje</h3>
        {allActions
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
                    deleteAction(item.id);
                  }}
                  className={styles.btn}
                >
                  Usuń
                </button>
              </div>
            );

          })}
        {countAction.length === 0 ? (
          <p className={styles.empty}>Brak akcji!</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AllActions;
