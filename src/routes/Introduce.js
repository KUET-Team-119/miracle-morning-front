import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import styles from "../css/Introduce.module.css";
import introduce from "../images/introduce_page.png";
import logoIcon from "../images/temp_logo.png";

function Introduce() {
  const navigate = useNavigate();

  const goToEnter = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={logoIcon} alt="로고" />
      <h1 className={styles.title}>
        나를 키우는 공간
        <br />
        미라클 농장🌱
      </h1>
      <Button
        className={styles.goBackBtn}
        type="button"
        variant="link"
        onClick={goToEnter}
      >
        로그인 화면으로 돌아가기
      </Button>
      <img className={styles.introduce} src={introduce} alt="소개 이미지" />
    </div>
  );
}

export default Introduce;
