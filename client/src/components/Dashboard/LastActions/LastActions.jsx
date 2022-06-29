import styles from "./LastActions.module.scss";
import Axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { ShowContentContext } from "../../../Contexts/ShowContentContext";

const LastActions = ({ userId, inc, exp }) => {
  const history = useHistory();
  const { content, setContent } = useContext(ShowContentContext);

  const countAction = [];
  const allActions = [...inc, ...exp];

  return (
    <div className={styles.lastActions}>
      <h3 className={styles.info}>Hisotria ostatnich akcji</h3>
      <div className={styles.panel}>
        {allActions

          .filter((item) => userId == item.id_user)
          .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .slice(0, 5)
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
              </div>
            );
          })}

        {countAction.length === 0 ? (
          <p className={styles.empty}>Brak akcji!</p>
        ) : (
          ""
        )}
      </div>
      <div
        onClick={() => {
          setContent("all");
          history.push("dashboard/all_actions");
        }}
        className={styles.link}
      >
        Wszystkie akcje
      </div>
    </div>
  );
};

export default LastActions;
