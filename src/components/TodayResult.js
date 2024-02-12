import { useState } from "react";
import styles from "../css/TodayResult.module.css";

function TodayResult({ resultId, routineName, createdAt, doneAt }) {
  const [totalRoutinesCount, setTotalRoutinesCount] = useState(0);
  const [completeRoutinesCount, setCompleteRoutinesCount] = useState(0);

  return (
    <>
      <div className="d-flex justify-content-start">
        <div
          className={
            doneAt !== null ? styles.completeResult : styles.incompleteResult
          }
        />
        <div>{routineName}</div>
        <div className="ms-auto">{doneAt}에 완료!</div>
      </div>
    </>
  );
}

export default TodayResult;
