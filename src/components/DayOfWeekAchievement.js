import { useEffect, useState } from "react";
import useAxiosGet from "../hook/useAxiosGet";
import styles from "../css/DayOfWeekAchievement.module.css";
import { ProgressBar } from "react-bootstrap";

function DayOfWeekAchievement() {
  const [response, setResponse] = useState([]);

  // 오늘의 루틴 조회
  const { responseData, error, isLoading } = useAxiosGet({
    url: `/api/results/week`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponse(responseData);
        console.log(responseData);
      } else {
        // console.log(error);
      }
    }
  }, [responseData, error, isLoading]);

  return (
    <div className={styles.container}>
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
  );
}

export default DayOfWeekAchievement;
