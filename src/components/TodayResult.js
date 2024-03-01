import styles from "../css/TodayResult.module.css";
import moment from "moment";

function TodayResult({ routineName, doneAt }) {
  return (
    <div className={styles.container}>
      <div
        className={
          doneAt !== null ? styles.completeResult : styles.incompleteResult
        }
      />
      <div>{routineName}</div>
      <div className={`${styles.doneTime} ms-auto`}>
        {doneAt !== null
          ? `${moment(doneAt).format("HH:MM")}에 완료!`
          : `미달성`}
      </div>
    </div>
  );
}

export default TodayResult;
