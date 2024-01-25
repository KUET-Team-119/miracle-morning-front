import RoutineCalendar from "../components/RoutineCalendar";
import styles from "../css/Statistics.module.css";
import { Link } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";

function Statistics() {
  const who = useDecodingJwt();
  return (
    <div className={styles.statisticsBody}>
      <div className={styles.statisticsContainer}>
        <div className={styles.header}>
          <h4>{who}님의 루틴 현황입니다.</h4>
          <div>
            <Link to={`/mypage/${who}`}>MyPage</Link>
          </div>
        </div>
        <div className={styles.content}>
          <Link to={`/statistics/detail/${who}`}>자세히 보기</Link>
          <RoutineCalendar />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
