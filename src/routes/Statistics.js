import { useState } from "react";
import RoutineCalendar from "../components/RoutineCalendar";
import styles from "../css/Statistics.module.css";
import { Link, useParams } from "react-router-dom";

function Statistics() {
  const [isChallenging, setIsChallenging] = useState(false);
  const { memberName } = useParams();
  return (
    <div className={styles.statisticsBody}>
      <div className={styles.statisticsContainer}>
        <div className={styles.header}>
          <h4>{memberName}님의 루틴 현황입니다.</h4>
          <div>
            <Link to={`/mypage/${memberName}`}>MyPage</Link>
          </div>
        </div>
        <div className={styles.content}>
          <p>이달의 챌린지 | {isChallenging ? "참여" : "미참여"}</p>
          <Link to={`/statistics/detail/${memberName}`}>자세히 보기</Link>
          <RoutineCalendar />
        </div>
        <div className={styles.navContainer}>
          <div className="navItem">
            <Link to={`/home/${memberName}`}>홈</Link>
          </div>
          <div className={styles.navContainer}>
            <Link to={`/routines/${memberName}`}>루틴관리</Link>
          </div>
          <div className={styles.navContainer}>
            <Link to={`/statistics/${memberName}`}>루틴현황</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
