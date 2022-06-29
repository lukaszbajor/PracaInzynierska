import { Bar } from "react-chartjs-2";
import Axios from "axios";
import { useState, useEffect } from "react";

function DoughnutChartInTw() {
  const [dataA, setDataA] = useState([]);
  const [year, setYear] = useState("2022");
  const getDataA = () => {
    let newUrl;
    if (year === "2020") {
      newUrl = "http://localhost:3000/getstatstwoincomes";
    } else if (year === "2021") {
      newUrl = "http://localhost:3000/getstatstwoincomes-1";
    } else {
      newUrl = "http://localhost:3000/getstatstwoincomes-2";
    }
    Axios.get(newUrl).then((response) => {
      setDataA([...response.data]);
    });
  };

  useEffect(() => {
    getDataA();
  }, [year]);

  const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

  const data = {
    labels: year === "2022" ? [...months] : [...months].reverse(),
    datasets: [
      {
        label: "Przychód",
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
    options: {
      title: {
        display: true,
        text: "Custom Chart Title",
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div>
      <h3 style={{ textAlign: "center", marginLeft: "10px" }}>
        W którym uzyskano największy przychód w skali roku: <span>{year}</span>?
      </h3>
      <select
        onChange={(e) => {
          setYear(e.target.value);
        }}
      >
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>
      <div style={{ width: "500px", margin: "0 auto" }}>
        {dataA.length > 0 ? (
          <Bar data={data} />
        ) : (
          <p>Brak danych do statystyk!</p>
        )}
      </div>
    </div>
  );
}

export default DoughnutChartInTw;
