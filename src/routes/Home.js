import styles from "../css/Home.module.css";
import RestRoutineItem from "../components/RestRoutineItem";
import ClearRoutineItem from "../components/ClearRoutineItem";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Home() {
  const [restRoutines, setRestRoutines] = useState([]);
  const [clearRoutines, setClearRoutines] = useState([]);
  const [routinesCount, setRoutinesCount] = useState(-1);
  const [tempToReload, setTempToReload] = useState(true);
  const { memberName } = useParams();

  // To-do 사용자가 {memberName}을 임의로 바꾸면 보안 사고 발생 -> 보완하기
  const getRestRoutines = async () => {
    try {
      const response = await axios.get(`/api/routines/rest/${memberName}`);
      response.data.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setRestRoutines(response.data);
      setRoutinesCount(response.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  // To-do 사용자가 {memberName}을 임의로 바꾸면 보안 사고 발생 -> 보완하기
  const getClearRoutines = async () => {
    try {
      const response = await axios.get(`/api/routines/clear/${memberName}`);
      response.data.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setClearRoutines(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRestRoutines();
    getClearRoutines();
  }, [tempToReload]); // 마운트 때만 정보 가져옴 -> 변경해야 함

  // GET 메소드 재호출 유도
  const reload = () => {
    setTempToReload((current) => !current);
  };

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
              <Link to={`/mypage/${memberName}`}>MyPage</Link>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.intro}>
              <p>완벽한 하루까지 {routinesCount}개의 루틴이 남았어요</p>
            </div>
            <div className={styles.routineContainer}>
              {restRoutines.map((routine) => (
                <RestRoutineItem
                  key={routine.routineId}
                  routineId={routine.routineId}
                  routineName={routine.routineName}
                  strategy={routine.strategy}
                  certification={routine.certification}
                  startTime={routine.startTime}
                  endTime={routine.endTime}
                  setTempToReload={reload}
                />
              ))}
            </div>
            <div className={styles.routineContainer}>
              {clearRoutines.map((routine) => (
                <ClearRoutineItem
                  key={routine.routineId}
                  routineId={routine.routineId}
                  routineName={routine.routineName}
                  strategy={routine.strategy}
                  certification={routine.certification}
                  startTime={routine.startTime}
                  endTime={routine.endTime}
                  setTempToReload={reload}
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
