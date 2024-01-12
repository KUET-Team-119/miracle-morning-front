import styles from "../css/Home.module.css";
import TodayRoutineItem from "../components/TodayRoutineItem";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Home() {
  const [routines, setRoutines] = useState([]);
  const { memberName } = useParams();
  const [restRoutine, setRestRoutine] = useState(-1);

  // To-do 사용자가 {memberName}을 임의로 바꾸면 보안 사고 발생 -> 보완하기
  const getRoutines = async () => {
    try {
      const response = await axios.get(`/api/routine/${memberName}`);
      response.data.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setRoutines(response.data);
      setRestRoutine(response.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoutines();
  }, []); // 마운트 때만 정보 가져옴 -> 변경해야 함

  return (
    <div>
      <div className={styles.homeBody}>
        <div className={styles.homeContainer}>
          <div className={styles.header}>
            <h4>
              안녕하세요 {memberName}님!
              <br />
              오늘도 좋은 하루 보내세요~
            </h4>
            <div>
              <p>MyPage</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.intro}>
              <p>완벽한 하루까지 {restRoutine}개의 루틴이 남았어요</p>
            </div>
            <div className={styles.routineContainer}>
              {routines.map((routine) => (
                <TodayRoutineItem
                  key={routine.routineId}
                  routineId={routine.routineId}
                  routineName={routine.routineName}
                  strategy={routine.strategy}
                  certification={routine.certification}
                  startTime={routine.startTime}
                  endTime={routine.endTime}
                />
              ))}
            </div>
          </div>
          <div className={styles.navContainer}>
            <div className={styles.navItem}>
              <Link to={`/home/${memberName}`}>홈</Link>
            </div>
            <div className={styles.navItem}>
              <Link to={`/routines/${memberName}`}>루틴관리</Link>
            </div>
            <div className={styles.navItem}>
              <Link to={`/statistics/${memberName}`}>루틴현황</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
