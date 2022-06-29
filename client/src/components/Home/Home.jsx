import styles from "./Home.module.scss";
const Home = () => {
  return (
    <div className="box">
      <div className="item">
        <i className="fas fa-piggy-bank piggy"></i>
        <p className="text">
          Skorzystaj z aplikacji i kontroluj swoje pieniądze.
        </p>
      </div>
      <div className="item">
        <i class="far fa-chart-bar piggy"></i>
        <p className="text">Sprawdzaj stan konta na wykresach.</p>
      </div>
      <div className="item">
        <i class="fas fa-calendar-alt piggy"></i>
        <p className="text">
          Planuj akcje cykliczne i zautomatyzuj kontrolę swoich środków.
        </p>
      </div>
    </div>
  );
};

export default Home;
