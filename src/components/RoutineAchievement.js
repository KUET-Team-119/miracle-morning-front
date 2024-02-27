import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosGet from "../hook/useAxiosGet";
import styles from "../css/RoutineAchievement.module.css";
import { Spinner, ProgressBar } from "react-bootstrap";

function RoutineAchievement() {
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();

  // 오늘의 루틴 조회
  const { responseData, error, isLoading } = useAxiosGet({
    url: `/api/results/routines`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponse(responseData);
      } else {
        const status = error.response.status;
        if (status === 401) {
          navigate("/unauthorized");
        } else if (status === 403) {
          navigate("/forbidden");
        } else if (status === 404) {
          navigate("/not-found");
        } else {
          navigate("/server-error");
        }
      }
    }
  }, [responseData, error, isLoading]);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" />
        </div>
      ) : (
        <div className={styles.content}>
          {response.length !== 0 ? (
            response.map((routine) => (
              <div className={styles.rateContainer} key={routine.routineName}>
                <div className={styles.dayOfWeek}>🌱{routine.routineName}</div>
                <ProgressBar
                  className={styles.progressBar}
                  now={routine.achievement}
                  label={`${routine.achievement}%`}
                />
              </div>
            ))
          ) : (
            <p className={styles.noRoutine}>기록이 없어요</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RoutineAchievement;
