import { useEffect, useState } from "react";
import useAxiosGet from "../hook/useAxiosGet";
import styles from "../css/RoutineAchievement.module.css";
import { ProgressBar } from "react-bootstrap";

function RoutineAchievement() {
  const [response, setResponse] = useState([]);

  // 오늘의 루틴 조회
  const { responseData, error, isLoading } = useAxiosGet({
    url: `/api/results/routines`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponse(responseData);
        // console.log(responseData);
      } else {
        // console.log(error);
      }
    }
  }, [responseData, error, isLoading]);

  return (
    <div className={styles.container}>
      {response.map((routine) => (
        <div className={styles.rateContainer} key={routine.routineName}>
          <div className={styles.dayOfWeek}>🌱{routine.routineName}</div>
          <ProgressBar
            className={styles.progressBar}
            now={routine.achievement}
            label={`${routine.achievement}%`}
          />
        </div>
      ))}
    </div>
  );
}

export default RoutineAchievement;
