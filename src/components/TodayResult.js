import styles from "../css/TodayResult.module.css";
import moment from "moment";

function TodayResult({ resultId, routineName, createdAt, doneAt }) {
  return (
    <>
      <div className="d-flex justify-content-start">
        <div className="d-flex align-items-center">
          <div
            className={
              doneAt !== null ? styles.completeResult : styles.incompleteResult
            }
          />
        </div>
        <div>{routineName}</div>
        <div className="ms-auto">
          {doneAt !== null
            ? `${moment(doneAt).format("HH:MM")}에 완료!`
            : `미달성`}
        </div>
      </div>
    </>
  );
}

export default TodayResult;
