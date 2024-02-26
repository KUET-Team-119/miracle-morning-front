import { useNavigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";
import { Alert } from "react-bootstrap";
import styles from "../css/Forbidden.module.css";

function Forbidden() {
  const { myName } = useDecodingJwt();
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      <div className={styles.alert}>
        <Alert variant="danger">
          <p>{myName}님이 접근할 수 없는 페이지입니다.⛔</p>
          <hr />
          <div>
            <Alert.Link onClick={goToHome}>홈 화면</Alert.Link>으로 돌아가기
          </div>
        </Alert>
      </div>
    </div>
  );
}

export default Forbidden;
