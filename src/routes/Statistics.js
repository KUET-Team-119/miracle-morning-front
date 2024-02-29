import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoutineCalendar from "../components/RoutineCalendar";
import useDecodingJwt from "../hook/useDecodingJwt";
import Menu from "../components/Menu";
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
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <div className={styles.intro}>
            <p>
              <span>{myName}</span>님의 알찬
            </p>
            <p>한 달을 확인해보세요🌳</p>
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
      </div>
      <Tabs className={styles.tabs} defaultActiveKey="eachMonth" justify>
        <Tab className={styles.tabContent} eventKey="eachMonth" title="월별">
          <RoutineCalendar />
        </Tab>
        <Tab className={styles.tabContent} eventKey="eachDay" title="요일별">
          <DayOfWeekAchievement />
        </Tab>
        <Tab
          className={styles.tabContent}
          eventKey="eachRoutine"
          title="루틴별"
        >
          <RoutineAchievement />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Statistics;
