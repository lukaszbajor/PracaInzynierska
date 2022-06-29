import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import styles from "./CyclicActions.module.scss";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BalanceContext } from "../../Contexts/BalanceContext";
import { ShowContentContext } from "../../Contexts/ShowContentContext";

const CyclicActions = ({ userId, getData, inc, exp }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [value, setValue] = useState(0);
  const [date, setDate] = useState("");
  const [optionId, setOptionId] = useState(0);
  const [option, setOption] = useState("empty");
  const [allCategory, setAllCategory] = useState([]);
  const { userBalance, setUserBalance, userSavings, setUserSavings } =
    useContext(BalanceContext);
  const [countDays, setCountDays] = useState(0);

  const { content, setContent } = useContext(ShowContentContext);
  console.log(userId);
  const countAction = [];
  const allActions = [...inc, ...exp];

  const getAllCategoryIn = () => {
    const url = `http://localhost:3000/`;
    let newUrl = null;
    if (option === "empty") return;

    {
      option === "income"
        ? (newUrl = `${url}allcategoryin`)
        : (newUrl = `${url}allcategoryexp`);

      Axios.get(newUrl)
        .then((response) => {
          const allCategoryIn = [...response.data];
          setAllCategory(allCategoryIn);
        })
        .catch((err) => {
          console.error("Coś poszło nie tak!");
        });
    }
  };

  useEffect(() => {
    console.log(option);
    getAllCategoryIn();
  }, [option]);

  const addAction = (e) => {
    let newValue = 0;
    let newValueSavings = 0;
    const url = `http://localhost:3000/`;
    let newUrl = null;

    e.preventDefault();
    if (option === "empty" || category === "")
      return toast.error("Wybierz akcje!");

    {
      option === "income"
        ? (newUrl = `${url}addincome`)
        : (newUrl = `${url}addexpense`);

      Axios.post(newUrl, {
        name: name,
        value: value,
        id_category: optionId,
        date: date,
        id_user: userId,
        is_cyclic: 1,
        cyclic_days: countDays,
      })
        .then((response) => {
          toast.success("Akcja dodana!");
        })
        .catch((err) => {
          toast.error("Coś poszło nie tak!");
        });
    }

    {
      newValue = Number(userBalance) + Number(value);
    }

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

    if (category === "Odkładam na konto") {
      newValueSavings = userSavings - value;
      Axios.put("http://localhost:3000/updatesavings", {
        id: Number(userId),
        savings: Number(newValueSavings),
      })
        .then((response) => {
          getData();
        })
        .catch((err) => {
          toast.error(err);
        });
      setUserSavings(newValueSavings);
    }

    setUserBalance(newValue);

    e.target.reset();
  };

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
          toast.success("Poprawnie usunięto");
          getData();
        });
      });
    }
    if (expense) {
      expense.map((item) => {
        Axios.delete(`${url}deleteexpense/${id}`).then((response) => {
          toast.success("Poprawnie usunięto");
          getData();
        });
      });
    }
    getData();
  };

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
        <form className={styles.addForm} onSubmit={addAction}>
          <h3 className={styles.infoPl}>Dodaj akcję cykliczną</h3>
          <label htmlFor="action-select">Wybierz akcje:</label>
          <select
            name="actions"
            id="action-select"
            required
            onChange={(e) => {
              setOption(e.target.value);
            }}
          >
            <option value="empty">Wybierz</option>
            <option value="income">Przychód</option>
            <option value="expense">Rozchód</option>
          </select>
          <br />
          <label htmlFor="name" className={styles.labelMargin}>
            Nazwa:
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
          <label htmlFor="category">Kategoria:</label>
          <select
            name="category"
            id="category"
            required
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">Wybierz</option>
            {allCategory.map((option) => {
              return (
                <option
                  value={option.name}
                  key={option.name}
                  onClick={() => {
                    setOptionId(option.id);
                  }}
                >
                  {option.name}
                </option>
              );
            })}
          </select>
          <br />
          <label htmlFor="value" className={styles.labelMargin}>
            Kwota:
          </label>
          <input
            type="number"
            required
            step="0.01"
            onChange={(e) => {
              if (option === "income") {
                setValue(e.target.value);
              } else {
                setValue(-e.target.value);
              }
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
          <label htmlFor="coutDays" className={styles.labelMargin}>
            Co ile dni wykonać akcje?
          </label>
          <input
            type="number"
            id="countDays"
            onChange={(e) => {
              setCountDays(e.target.value);
            }}
            className={styles.log}
          />
          <br />
          <div className={styles.btns}>
            <input type="submit" value="Dodaj" />
            <input type="reset" value="Wyczyść" />
          </div>
        </form>

        <div className={styles.lastActions}>
          <h3 className={styles.info}>Hisotria cyklicznych akcji</h3>
          <div className={styles.panel}>
            {allActions

              .filter((item) => userId == item.id_user && item.is_cyclic === 1)
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
      </div>
    </div>
  );
};

export default CyclicActions;
