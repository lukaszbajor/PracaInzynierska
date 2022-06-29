import { useState, useEffect } from "react";
import Axios from "axios";
import styles from "./Stats.module.scss";

import { Doughnut } from "react-chartjs-2";
import DoughnutChartExp from "../../charts/Doughnut";
import DoughnutChartIn from "../../charts/DoughnutTwo";
import DoughnutChartExpTw from "../../charts/DoughnutThree";
import DoughnutChartInTw from "../../charts/DoughnutFour";

const Stats = () => {
  return (
    <div className={styles.box}>
      <div className={styles.first}>
        <DoughnutChartExp />
        <DoughnutChartIn />
      </div>
      <div className={styles.second}>
        <DoughnutChartExpTw />
        <DoughnutChartInTw />
      </div>
    </div>
  );
};

export default Stats;
