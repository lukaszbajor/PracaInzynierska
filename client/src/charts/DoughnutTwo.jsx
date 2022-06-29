import { Pie } from "react-chartjs-2";
import Axios from "axios";
import { useState, useEffect } from "react";

function DoughnutChartIn() {
  const [dataA, setDataA] = useState([""]);
  let xd = [];
  const getDataA = () => {
    Axios.get("http://localhost:3000/getstatsincomes").then((response) => {
      setDataA([...response.data]);
    });
  };

  useEffect(() => {
    getDataA();
  }, []);

  const data = {
    labels: dataA.map((x) => x.name),

    datasets: [
      {
        data: dataA.map((x) => x.procent),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
      },
    ],
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>
        Przychody z poszczególnych kategorii
      </h3>
      <div style={{ width: "500px", margin: "0 auto" }}>
        {dataA.length > 0 ? (
          <Pie data={data} />
        ) : (
          <p>Brak danych do statystyk!</p>
        )}
      </div>
    </div>
  );
}

export default DoughnutChartIn;
