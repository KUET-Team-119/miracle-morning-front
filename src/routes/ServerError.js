import { Alert } from "react-bootstrap";
import styles from "../css/ServerError.module.css";

function ServerError() {
  return (
    <div className={styles.container}>
      <div className={styles.alert}>
        <Alert variant="danger">
          <p>서버에 장애가 발생했습니다⛔</p>
          <hr />
          <div>조금 뒤에 다시 시도해주세요.</div>
        </Alert>
      </div>
    </div>
  );
}

export default ServerError;
