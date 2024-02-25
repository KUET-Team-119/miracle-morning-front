import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosGet from "../hook/useAxiosGet";
import styles from "../css/DayOfWeekAchievement.module.css";
import { Spinner, ProgressBar } from "react-bootstrap";

function DayOfWeekAchievement() {
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();

  // 오늘의 루틴 조회
  const { responseData, error, isLoading } = useAxiosGet({
    url: `/api/results/week`,
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
          {response.map((day) => (
            <div className={styles.rateContainer} key={day.dayOfWeek}>
              <div className={styles.dayOfWeek}>🌱{day.dayOfWeek}</div>
              <ProgressBar
                className={styles.progressBar}
                now={day.achievement}
                label={`${day.achievement}%`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DayOfWeekAchievement;
