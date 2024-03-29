import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosGet from "../hook/useAxiosGet";
import useAxiosPost from "../hook/useAxiosPost";
import useDecodingJwt from "../hook/useDecodingJwt";
import Menu from "../components/Menu";
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

const MAX_ROUTINES_COUNT = 20;

function Managing() {
  const { myName } = useDecodingJwt();
  const [routines, setRoutines] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [preventModalShow, setPreventModalShow] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newDayOfWeek, setNewDayOfWeek] = useState("");
  const [mon, setMon] = useState("0");
  const [tue, setTue] = useState("0");
  const [wed, setWed] = useState("0");
  const [thu, setThu] = useState("0");
  const [fri, setFri] = useState("0");
  const [sat, setSat] = useState("0");
  const [sun, setSun] = useState("0");
  const [newCertification, setNewCertification] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [requestData, setRequestData] = useState("");
  const [menuShow, setMenuShow] = useState(false);
  const [isEveryDay, setIsEveryDay] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [routinesCount, setRoutinesCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const navigate = useNavigate();

  // 사용자의 루틴 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/routine`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        if (responseData.length !== 0) {
          setRoutinesCount(responseData.length);
        }

        const sortedResponseData = [...responseData]; // 복사본을 만들어 정렬
        sortedResponseData.sort((a, b) => {
          // isActivated가 true인 경우를 먼저 정렬, false인 경우는 나중에 정렬
          if (a.isActivated === b.isActivated) {
            // isActivated 값이 같은 경우 routineName으로 오름차순 정렬
            return a.routineName.localeCompare(b.routineName, "ko-KR", {
              numeric: true,
            });
          } else {
            return a.isActivated ? -1 : 1; // true가 앞에 오도록 정렬
          }
        });
        setRoutines(sortedResponseData);
      } else {
        const status = error.response.status;
        if (status === 401) {
          navigate("/unauthorized");
        } else if (status === 403) {
          navigate("/forbidden");
        } else if (status === 404) {
          navigate("/not-found");
        } else {
          navigate("/server-error");
        }
      }
    }
  }, [responseData, error, isLoading]);

  // 데이터 객체를 json 형태로 변환
  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        routineName: newRoutineName,
        memberName: myName,
        dayOfWeek: newDayOfWeek,
        certification: newCertification,
        startTime: newStartTime,
        endTime: newEndTime,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPost = (e) => {
    e.preventDefault();
    setIsClicked(true);
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
        const status = errorPost.response.status;
        if (status === 401) {
          navigate("/unauthorized");
        } else if (status === 403) {
          navigate("/forbidden");
        } else if (status === 404) {
          navigate("/not-found");
        } else if (status === 409) {
          openErrorModalShow();
        } else {
          navigate("/server-error");
        }
      }
    }
  }, [responseDataPost, errorPost, isLoadingPost]);

  const changeRoutineName = (e) => {
    setNewRoutineName(e.target.value);
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
    newDayOfWeek !== "0000000" &&
    newCertification !== "" &&
    newStartTime !== "" &&
    newEndTime !== "" &&
    newStartTime <= newEndTime &&
    !isClicked;

  // 루틴 추가 모달 열기
  const openAddModal = () => {
    setAddModalShow(true);
  };

  // 루틴 추가 모달 닫기
  const closeAddModal = () => {
    setAddModalShow(false);
    setNewRoutineName("");
    setNewCertification("");
    setNewStartTime("");
    setNewEndTime("");
    setNewDayOfWeek("");
    setMon("0");
    setTue("0");
    setWed("0");
    setThu("0");
    setFri("0");
    setSat("0");
    setSun("0");
    setIsEveryDay(false);
    setIsAllDay(false);
    setIsClicked(false);
  };

  // 루틴 추가 방지 모달 열기
  const openPreventModalShow = () => {
    setPreventModalShow(true);
  };

  // 루틴 추가 방지 모달 닫기
  const closePreventModalShow = () => {
    setPreventModalShow(false);
  };

  // 에러 모달 열기
  const openErrorModalShow = () => {
    setErrorModalShow(true);
  };

  // 에러 모달 닫기
  const closeErrorModalShow = () => {
    setErrorModalShow(false);
  };

  const goToHome = () => {
    navigate("/home");
  };

  const changeEveryDay = () => {
    if (newDayOfWeek !== "1111111" && !isEveryDay) {
      setMon("1");
      setTue("1");
      setWed("1");
      setThu("1");
      setFri("1");
      setSat("1");
      setSun("1");
    } else if (newDayOfWeek === "1111111" && isEveryDay) {
      setMon("0");
      setTue("0");
      setWed("0");
      setThu("0");
      setFri("0");
      setSat("0");
      setSun("0");
    }
    setIsEveryDay((current) => !current);
  };

  const changeAllDay = () => {
    setIsAllDay((current) => !current);
  };

  useEffect(() => {
    const tempDayOfWeek = mon + tue + wed + thu + fri + sat + sun;
    setNewDayOfWeek(tempDayOfWeek);
  }, [mon, tue, wed, thu, fri, sat, sun]);

  // 월요일 버튼 클릭 시 상태 및 색상 변경
  const changeMon = () => {
    setMon((prevMon) => (prevMon === "0" ? "1" : "0"));
  };

  // 화요일 버튼 클릭 시 상태 및 색상 변경
  const changeTue = () => {
    setTue((prevTue) => (prevTue === "0" ? "1" : "0"));
  };

  // 수요일 버튼 클릭 시 상태 및 색상 변경
  const changeWed = () => {
    setWed((prevWed) => (prevWed === "0" ? "1" : "0"));
  };

  // 목요일 버튼 클릭 시 상태 및 색상 변경
  const changeThu = () => {
    setThu((prevThu) => (prevThu === "0" ? "1" : "0"));
  };

  // 금요일 버튼 클릭 시 상태 및 색상 변경
  const changeFri = () => {
    setFri((prevFri) => (prevFri === "0" ? "1" : "0"));
  };

  // 토요일 버튼 클릭 시 상태 및 색상 변경
  const changeSat = () => {
    setSat((prevSat) => (prevSat === "0" ? "1" : "0"));
  };

  // 일요일 버튼 클릭 시 상태 및 색상 변경
  const changeSun = () => {
    setSun((prevSun) => (prevSun === "0" ? "1" : "0"));
  };

  useEffect(() => {
    if (isAllDay) {
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
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <div className={styles.intro}>
              <p>
                <span>{myName}</span>님의
              </p>
              <p>루틴 List🌱</p>
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
        </div>
        <div className={styles.routinesContainer}>
          <div className={styles.routinesContainerHeader}>
            <p>🌱 수정하고 싶은 루틴을 클릭해요</p>
            <img
              src={addIcon}
              onClick={
                routinesCount !== MAX_ROUTINES_COUNT
                  ? openAddModal
                  : openPreventModalShow
              }
              alt="루틴 추가"
            />
          </div>
          {isLoading ? (
            <div className={styles.spinner}>
              <Spinner animation="border" />
            </div>
          ) : routines.length !== 0 ? (
            <div className={styles.routinesList}>
              {routines.map((routine) => (
                <MyRoutine
                  key={routine.routineId}
                  routineId={routine.routineId}
                  routineName={routine.routineName}
                  dayOfWeek={routine.dayOfWeek}
                  certification={routine.certification}
                  startTime={routine.startTime}
                  endTime={routine.endTime}
                  isActivated={routine.isActivated}
                  setToReload={refetch}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noRoutine}>
              <p>등록된 루틴이 없어요</p>
              <p>플러스 버튼을 눌러 루틴을 추가하세요</p>
            </div>
          )}
        </div>
      </div>
      <Modal show={addModalShow} centered>
        <Form onSubmit={submitPost}>
          <Modal.Body className={styles.addModalBody}>
            <div className={styles.routineName}>
              <div className={styles.addModalBodyTitle}>🌱 루틴명</div>
              <Form.Control
                type="text"
                value={newRoutineName}
                placeholder="ex) 물 마시기(10자 이내)"
                onChange={changeRoutineName}
                maxLength={10}
              />
              <div className={styles.modalNameNotice}>
                루틴명은 중복될 수 없고, 추후에 변경이 불가능해요
              </div>
            </div>
            <div className={styles.dayOfWeek}>
              <div className={styles.addModalBodyTitle}>🌱 실천 요일</div>
              <ButtonGroup className={styles.dayOfWeekGroup}>
                <Button
                  className={
                    mon === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={mon}
                  onClick={changeMon}
                  disabled={isEveryDay}
                >
                  월
                </Button>
                <Button
                  className={
                    tue === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={tue}
                  onClick={changeTue}
                  disabled={isEveryDay}
                >
                  화
                </Button>
                <Button
                  className={
                    wed === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={wed}
                  onClick={changeWed}
                  disabled={isEveryDay}
                >
                  수
                </Button>
                <Button
                  className={
                    thu === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={thu}
                  onClick={changeThu}
                  disabled={isEveryDay}
                >
                  목
                </Button>
                <Button
                  className={
                    fri === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={fri}
                  onClick={changeFri}
                  disabled={isEveryDay}
                >
                  금
                </Button>
                <Button
                  className={
                    sat === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={sat}
                  onClick={changeSat}
                  disabled={isEveryDay}
                >
                  토
                </Button>
                <Button
                  className={
                    sun === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={sun}
                  onClick={changeSun}
                  disabled={isEveryDay}
                >
                  일
                </Button>
              </ButtonGroup>
              <div className={styles.modalNotice}>
                자유롭게 요일을 선택할 수 있어요
              </div>
              <div className={styles.checkEveryDay}>
                <div className={styles.modalNotice}>매일</div>
                <input
                  type="checkbox"
                  checked={isEveryDay}
                  onChange={changeEveryDay}
                />
              </div>
            </div>
            <div className={styles.actionTime}>
              <div className={styles.addModalBodyTitle}>🌱 실천 시간</div>
              <InputGroup>
                <Form.Control
                  type="time"
                  value={newStartTime}
                  onChange={changeStartTime}
                  disabled={isAllDay}
                />
                <InputGroup.Text>~</InputGroup.Text>
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
            <div className={styles.certification}>
              <div className={styles.addModalBodyTitle}>🌱 인증 방법</div>
              <Form.Control
                as="textarea"
                value={newCertification}
                placeholder="ex) 물이 따라진 컵 사진 촬영(30자 이내)"
                rows={2}
                maxLength={30}
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
              disabled={!isValid}
              onClick={objToJson}
            >
              만들기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={preventModalShow} centered>
        <Modal.Body className={styles.preventModalBody}>
          <p className={styles.preventModalBodyTitle}>
            ⛔ 더 이상 추가할 수 없습니다
          </p>
          <p className={styles.preventModalBodyContent}>
            루틴은 20개까지 등록할 수 있어요
          </p>
          <Button
            className={styles.preventModalBtn}
            onClick={closePreventModalShow}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
      <Modal show={errorModalShow} centered>
        <Modal.Body className={styles.errorModalBody}>
          <p className={styles.errorModalBodyTitle}>⛔ 중복된 루틴입니다</p>
          <p className={styles.errorModalBodyContent}>
            다른 루틴명을 입력해주세요
          </p>
          <Button
            className={styles.errorModalBtn}
            onClick={closeErrorModalShow}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Managing;
