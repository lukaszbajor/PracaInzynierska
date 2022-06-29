import { useState, useEffect, useContext } from "react";
import styles from "./AddAction.module.scss";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BalanceContext } from "../../../Contexts/BalanceContext";

const AddAction = ({ userId, getData }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [value, setValue] = useState(0);
  const [date, setDate] = useState("");
  const [optionId, setOptionId] = useState(0);
  const [option, setOption] = useState("empty");
  const [allCategory, setAllCategory] = useState([]);
  const { userBalance, setUserBalance, userSavings, setUserSavings } =
    useContext(BalanceContext);

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
        .catch((err) => {});
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
    console.log(optionId);
    console.log(date);
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

    console.log(newValue);

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

  return (
    <form className={styles.addForm} onSubmit={addAction}>
      <h3 className={styles.info}>Dodaj przychód/rozchód</h3>
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
        min="0.01"
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
      <div className={styles.btns}>
        <input type="submit" value="Dodaj" />
        <input type="reset" value="Wyczyść" />
      </div>
    </form>
  );
};

export default AddAction;
