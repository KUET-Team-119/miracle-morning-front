import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosGet from "../hook/useAxiosGet";
import useAxiosPost from "../hook/useAxiosPost";
import useDecodingJwt from "../hook/useDecodingJwt";
import Menu from "../components/Offcanvas";
import MyRoutine from "../components/MyRoutine";
import {
  Button,
  Spinner,
  Modal,
  Form,
  InputGroup,
  ButtonGroup,
} from "react-bootstrap";
import styles from "../css/Managing.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";
import addIcon from "../images/add.png";

function Managing() {
  const { myName } = useDecodingJwt();
  const [routines, setRoutines] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newStrategy, setNewStrategy] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [requestData, setRequestData] = useState("");
  const [menuShow, setMenuShow] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);

  const navigate = useNavigate();

  // 사용자의 루틴 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/routine`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        const sortedResponseData = [...responseData]; // 복사본을 만들어 정렬
        sortedResponseData.sort((a, b) => {
          // isActivated가 true인 경우를 먼저 정렬, false인 경우는 나중에 정렬
          if (a.isActivated === b.isActivated) {
            // isActivated 값이 같은 경우 startTime으로 정렬
            return a.startTime.localeCompare(b.startTime);
          } else {
            return a.isActivated ? -1 : 1; // true가 앞에 오도록 정렬
          }
        });
        setRoutines(sortedResponseData);
      } else {
        // console.log(error);
      }
    }
  }, [responseData, error, isLoading]);

  // 데이터 객체를 json 형태로 변환
  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        routineName: newRoutineName,
        memberName: myName,
        strategy: newStrategy,
        certification: newCertification,
        startTime: newStartTime,
        endTime: newEndTime,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPost = (e) => {
    e.preventDefault();
    performPost();
  };
  // 사용자 루틴 추가
  const {
    responseData: responseDataPost,
    error: errorPost,
    isLoading: isLoadingPost,
    performPost,
  } = useAxiosPost({
    url: `/api/routine`,
    requestData,
  });
  useEffect(() => {
    if (!isLoadingPost) {
      if (responseDataPost !== null) {
        closeAddModal();
        refetch();
      } else {
        closeAddModal();
        setErrorModalShow(true);
      }
    }
  }, [responseDataPost, errorPost, isLoadingPost]);

  const changeRoutineName = (e) => {
    setNewRoutineName(e.target.value);
  };

  const changeStrategy = (e) => {
    setNewStrategy(e.target.value);
  };

  const changeCertification = (e) => {
    setNewCertification(e.target.value);
  };

  const changeStartTime = (e) => {
    const toTimeType = e.target.value + ":00";
    setNewStartTime(toTimeType);
  };

  const changeEndTime = (e) => {
    const toTimeType = e.target.value + ":00";
    setNewEndTime(toTimeType);
  };

  // 데이터 유효성 검사 -> 공백이 있는지와 시간 순서가 맞는지 구분하기
  const isValid =
    newRoutineName !== "" &&
    newStrategy !== "" &&
    newCertification !== "" &&
    newStartTime !== "" &&
    newEndTime !== "" &&
    newStartTime <= newEndTime;

  // 루틴 추가 모달 열기
  const openAddModal = () => {
    setAddModalShow(true);
  };

  // 루틴 추가 모달 닫기
  const closeAddModal = () => {
    setAddModalShow(false);
    setNewRoutineName("");
    setNewStrategy("");
    setNewCertification("");
    setNewStartTime("");
    setNewEndTime("");
    setIsAllDay(false);
  };

  const goToHome = () => {
    navigate("/home");
  };

  const changeAllDay = () => {
    setIsAllDay((current) => !current);
  };

  useEffect(() => {
    if (isAllDay === true) {
      setNewStartTime("00:00:00");
      setNewEndTime("23:59:00");
    }
  }, [isAllDay]);

  return (
    <>
      <div className={styles.container}>
        <Menu
          show={menuShow}
          onHide={() => {
            setMenuShow(false);
          }}
        />
        <div className={styles.header}>
          <div className={styles.intro}>
            <p>
              <span>{myName}</span>님의 루틴 List🌱
            </p>
          </div>
          <div className={styles.headerIcon}>
            <img src={homeIcon} onClick={goToHome} alt="홈" />
            <img
              src={menuIcon}
              onClick={() => {
                setMenuShow(true);
              }}
              alt="메뉴"
            />
          </div>
        </div>
        <div className={styles.routinesContainer}>
          <div className={styles.routinesContainerHeader}>
            <p>🌱 수정하고 싶은 루틴을 클릭해요</p>
            <img src={addIcon} onClick={openAddModal} alt="루틴 추가" />
          </div>
          <div className={styles.routinesList}>
            {isLoading ? (
              <div className={styles.spinner}>
                <Spinner animation="border" />
              </div>
            ) : (
              routines.map((routine) => (
                <MyRoutine
                  key={routine.routineId}
                  routineId={routine.routineId}
                  routineName={routine.routineName}
                  strategy={routine.strategy}
                  certification={routine.certification}
                  startTime={routine.startTime}
                  endTime={routine.endTime}
                  isActivated={routine.isActivated}
                  setToReload={refetch}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Modal show={addModalShow} centered>
        <Form onSubmit={submitPost}>
          <Modal.Body className={styles.addModalBody}>
            <div className={styles.routineName}>
              <div>🌱 루틴명</div>
              <Form.Control
                type="text"
                value={newRoutineName}
                placeholder="10자 이내"
                onChange={changeRoutineName}
                maxLength={10}
              />
              <div className={styles.modalNotice}>
                루틴명은 변경이 불가능해요.
              </div>
            </div>
            <div className={styles.dayOfWeek}>
              <div>🌱 실천 요일</div>
              <ButtonGroup className={styles.dayOfWeekGroup}>
                <Button className={styles.dayOfWeekBtn}>월</Button>
                <Button className={styles.dayOfWeekBtn}>화</Button>
                <Button className={styles.dayOfWeekBtn}>수</Button>
                <Button className={styles.dayOfWeekBtn}>목</Button>
                <Button className={styles.dayOfWeekBtn}>금</Button>
                <Button className={styles.dayOfWeekBtn}>토</Button>
                <Button className={styles.dayOfWeekBtn}>일</Button>
              </ButtonGroup>
              <div className={styles.modalNotice}>
                자유롭게 요일을 선택할 수 있어요.
              </div>
            </div>
            <div className={styles.actionTime}>
              <div>🌱 실천 시간</div>
              <InputGroup>
                <Form.Control
                  type="time"
                  value={newStartTime}
                  onChange={changeStartTime}
                  disabled={isAllDay}
                />
                <Form.Control
                  type="time"
                  value={newEndTime}
                  onChange={changeEndTime}
                  disabled={isAllDay}
                />
              </InputGroup>
              <div className={styles.checkAllDay}>
                <div className={styles.modalNotice}>하루종일</div>
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={changeAllDay}
                />
              </div>
            </div>
            <div className={styles.strategy}>
              <div>🌱 실천 전략</div>
              <Form.Control
                type="text"
                value={newStrategy}
                placeholder="(20자 이내)"
                maxLength={20}
                onChange={changeStrategy}
              />
            </div>
            <div className={styles.certification}>
              <div>🌱 인증 방법</div>
              <Form.Control
                type="text"
                value={newCertification}
                placeholder="ex) 물이 따라진 컵 사진 촬영(20자 이내)"
                maxLength={20}
                onChange={changeCertification}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button type="button" variant="secondary" onClick={closeAddModal}>
              닫기
            </Button>
            <Button
              className={styles.submitBtn}
              type="submit"
              disabled={isValid ? false : true}
              onClick={objToJson}
            >
              만들기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={errorModalShow} centered>
        <Modal.Body className={styles.errorModalBody}>
          <p>⛔ 중복된 루틴입니다.</p>
          <p>다른 루틴명을 입력해주세요.</p>
          <Button
            className={styles.errorModalBtn}
            variant="primary"
            onClick={() => setErrorModalShow(false)}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Managing;
