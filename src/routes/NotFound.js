import { Alert } from "react-bootstrap";
import styles from "../css/NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.alert}>
        <Alert variant="danger">
          <p>해당하는 리소스가 없습니다⛔</p>
          <hr />
          <div>URL을 다시 확인해보세요.</div>
        </Alert>
      </div>
    </div>
  );
}

export default NotFound;
