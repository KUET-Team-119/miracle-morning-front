import { useNavigate } from "react-router-dom";
import { Button, Col, Image, Row } from "react-bootstrap";
import styles from "../css/Introduce.module.css";
import checkRoutineImage from "../images/home_check_routine.png";
import manageImage from "../images/modify_routine.png";
import statisticsImage from "../images/result_month.png";
import logoIcon from "../images/logo.png";

function Introduce() {
  const navigate = useNavigate();
  const goToEnter = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <Image className={styles.logo} src={logoIcon} alt="로고" rounded />
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

      <section className={styles.mission}>
        <p className={styles.missionTitle}>MISSION</p>
        <p className={styles.missionKorean}>나를 키우는 공간</p>
        <p className={styles.missionEnglish}>A space where you grow yourself</p>
      </section>

      <section className={styles.identity}>
        <p className={styles.identitySubtitle}>IDENTITY</p>
        <p className={styles.identityTitle}>
          여러분은 어떤 사람이 되고 싶나요?
        </p>
        <p className={styles.identityExplain}>
          미라클 농장을 시작하기 전, 꼭 '나는 어떤 사람이 되고 싶은지'
          고민해보세요. <br />
          <br />
          예를 들어, '매일 10분 독서'를 루틴으로 설정하고 싶다고 해봅시다. 매일
          10분 독서를 실천하는 사람은 어떤 사람일까요? <br />
          '다방면의 지식을 쌓기 위해 노력하는 사람'이겠지요. 이처럼 루틴을
          설정할 때 자신이 되고 싶은 정체성을 생각해보세요. <br />
          <br />
          루틴을 실천하다 보면 어느새 여러분이 꿈꾸던 정체성이 되어있을 거예요.
        </p>
      </section>

      <section className={styles.function}>
        <div className={styles.functionTitle}>FUNCTION</div>
        <div className={styles.checkRoutine}>
          <Row className={styles.row}>
            <Col className={styles.imageCol}>
              <div className={styles.checkRoutineImageContainer}>
                <img
                  className={styles.checkRoutineImage}
                  src={checkRoutineImage}
                  alt="루틴 확인 화면"
                />
              </div>
            </Col>
            <Col className={styles.explainCol}>
              <div className={styles.checkRoutineExplain}>
                <p className={styles.checkRoutineExplainSubtitle}>
                  FUNCTION 1.
                </p>
                <p className={styles.checkRoutineExplainTitle}>
                  루틴 확인 및 인증
                </p>
                <p className={styles.checkRoutineExplainMain}>
                  나와 다른 사람들의 루틴을 확인하고 <br />
                  사진을 촬영해 루틴 실천을 인증하세요
                </p>
              </div>
            </Col>
          </Row>
        </div>

        <div className={styles.manageRoutine}>
          <Row className={styles.row}>
            <Col className={styles.explainCol}>
              <div className={styles.manageExplain}>
                <p className={styles.manageExplainSubtitle}>FUNCTION 2.</p>
                <p className={styles.manageExplainTitle}>루틴 관리</p>
                <p className={styles.manageExplainMain}>
                  수정하고 싶은 루틴이 있다면 <br />
                  요일/시간, 인증방법, 활성화 여부를 선택하세요
                </p>
              </div>
            </Col>
            <Col className={styles.imageCol}>
              <div className={styles.manageImageContainer}>
                <img
                  className={styles.manageImage}
                  src={manageImage}
                  alt="루틴 관리 화면"
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className={styles.statistics}>
          <Row className={styles.row}>
            <Col className={styles.imageCol}>
              <div className={styles.statisticsImageContainer}>
                <img
                  className={styles.statisticsImage}
                  src={statisticsImage}
                  alt="루틴 현황 화면"
                />
              </div>
            </Col>
            <Col className={styles.explainCol}>
              <div className={styles.statisticsExplain}>
                <p className={styles.statisticsExplainSubtitle}>FUNCTION 3.</p>
                <p className={styles.statisticsExplainTitle}>루틴 현황</p>
                <p className={styles.statisticsExplainMain}>
                  자신의 루틴 현황을 <br />
                  월별, 요일별, 루틴별로 살펴보세요
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className={styles.apply}>
        <div className={styles.applyContainer}>
          <p className={styles.applyMethod}>참여 방법</p>
          <p className={styles.applyPath}>
            <a
              className={styles.applyLink}
              href="https://www.instagram.com/j4zzun/"
            >
              INSTAGRAM&nbsp;&nbsp;|&nbsp;&nbsp;@j4zzun에게 신청하러 가기 →
            </a>
          </p>
        </div>
      </section>

      <footer>
        <p>&copy; 2024 미라클 농장. All rights reserved.</p>
        <p>Produced by 김도연, 이정진, 이희철, 허승준</p>
      </footer>
    </div>
  );
}

export default Introduce;
