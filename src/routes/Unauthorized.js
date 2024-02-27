import { Alert } from "react-bootstrap";
import styles from "../css/Unauthorized.module.css";

function Unauthorized() {
  return (
    <div className={styles.container}>
      <div className={styles.alert}>
        <Alert variant="danger">
          <p>⛔ 로그인 시간이 만료되었습니다</p>
          <hr />
          <div>
            <Alert.Link href="/">로그인 페이지</Alert.Link>로 이동하여 다시
            로그인해주세요
          </div>
        </Alert>
      </div>
    </div>
  );
}

export default Unauthorized;
