import { useContext } from "react";
import styles from "./Balance.module.scss";
import { BalanceContext } from "../../../Contexts/BalanceContext";

const Balance = () => {
  const { userBalance, setUserBalance } = useContext(BalanceContext);

  return (
    <div className={styles.wrap}>
      <div>Stan konta: {userBalance.toFixed(2)}</div>
    </div>
  );
};

export default Balance;
