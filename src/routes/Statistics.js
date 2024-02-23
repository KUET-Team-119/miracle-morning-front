import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoutineCalendar from "../components/RoutineCalendar";
import useDecodingJwt from "../hook/useDecodingJwt";
import Menu from "../components/Offcanvas";
import { Tab, Tabs } from "react-bootstrap";
import styles from "../css/Statistics.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";
import DayOfWeekAchievement from "../components/DayOfWeekAchievement";
import RoutineAchievement from "../components/RoutineAchievement";

function Statistics() {
  const { myName } = useDecodingJwt();

  const [menuShow, setMenuShow] = useState(false);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      <Menu
        show={menuShow}
        onHide={() => {
          setMenuShow(false);
        }}
      />
      <div className={styles.header}>
        <div className={styles.intro}>
          <p>
            <span>{myName}</span>님의 루틴 기록🌱
          </p>
        </div>
        <div className={styles.headerIcon}>
          <img src={homeIcon} onClick={goToHome} alt="홈" />
          <img
            src={menuIcon}
            onClick={() => {
              setMenuShow(true);
            }}
            alt="메뉴"
          />
        </div>
      </div>
      <Tabs className={styles.tabs} defaultActiveKey="summary" justify>
        <Tab eventKey="summary" title="요약">
          <RoutineCalendar />
        </Tab>
        <Tab eventKey="eachDay" title="요일별">
          <DayOfWeekAchievement />
        </Tab>
        <Tab eventKey="eachRoutine" title="루틴별">
          <RoutineAchievement />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Statistics;
