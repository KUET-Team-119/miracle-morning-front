import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import useDecodingJwt from "../hook/useDecodingJwt";
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import styles from "../css/TodayRoutine.module.css";

function TodayRoutine({
  routineId,
  routineName,
  memberName,
  certification,
  startTime,
  endTime,
  complete,
  doneAt,
  setToReload,
}) {
  const { myName } = useDecodingJwt();
  const [proveModalShow, setProveModalShow] = useState(false);
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [fileYear, setFileYear] = useState("");
  const [fileMonth, setFileMonth] = useState("");
  const [fileDay, setFileDay] = useState("");
  const [fileTime, setFileTime] = useState("");
  const [isValid, setIsValid] = useState(false);

  const objToJson = () => {
    setData(
      JSON.stringify({
        routineId: routineId,
        memberName: myName,
        doneAt: fileTime,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPatch = (e) => {
    e.preventDefault();
    patchProof();
  };
  const patchProof = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const blob = new Blob([data], {
      type: "application/json",
    });
    formData.append("data", blob);

    try {
      const response = await axios.patch(`/api/results`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      });
      setToReload(); // GET 메소드 재호출 유도
      closeProveModal();
    } catch (error) {
      console.error(error);
    }
  };

  const uploadedFile = (e) => {
    const fileData = e.target.files[0];
    // 파일이 선택되어야 함
    if (fileData !== undefined && fileData !== null) {
      setFile(fileData);
      const lastModifiedTimestamp = fileData.lastModified;
      const fileDateObj = new Date(lastModifiedTimestamp);
      const fileYear = fileDateObj.getFullYear();
      let fileMonth = fileDateObj.getMonth();
      let fileDate = fileDateObj.getDate();
      let fileHours = fileDateObj.getHours();
      let fileMinutes = fileDateObj.getMinutes();
      setFileYear(fileDateObj.getFullYear());
      setFileMonth(fileDateObj.getMonth());
      setFileDay(fileDateObj.getDate());
      if (fileMonth + 1 <= 9) {
        fileMonth = "0" + (fileMonth + 1);
      }
      if (fileDate <= 9) {
        fileDate = "0" + fileDate;
      }
      if (fileHours <= 9) {
        fileHours = "0" + fileHours;
      }
      if (fileMinutes <= 9) {
        fileMinutes = "0" + fileMinutes;
      }
      setFileTime(
        `${fileYear}-${fileMonth}-${fileDate}T${fileHours}:${fileMinutes}:00`
      );
    } else {
      setFile(null);
    }
  };

  useEffect(() => {
    const timeOnly = fileTime.substring(11, 19);
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    // 인증 버튼 유효성 검사
    setIsValid(false);
    // 조건 1. 파일 날짜 === 오늘 날짜
    if (
      fileYear === todayYear &&
      fileMonth === todayMonth &&
      fileDay === todayDay
    ) {
      console.log("1 클리어");
      // 조건 2. 파일 시간 <= 인증 시간
      if (timeOnly <= endTime) {
        setIsValid(true);
        console.log("2 클리어");
      }
    }
  }, [fileTime]);

  // 루틴 추가 모달 열기
  const openProveModal = () => {
    setProveModalShow(true);
  };

  // 인증 모달 닫기
  const closeProveModal = () => {
    setProveModalShow(false);
    setFile(null); // 파일 상태 초기화
    setFileYear(""); // 파일 날짜 관련 상태 초기화
    setFileMonth("");
    setFileDay("");
    setFileTime("");
    setIsValid(false);
  };

  return (
    <>
      <div className={styles.container}>
        <Card
          body
          className={
            complete ? styles.completeRoutine : styles.incompleteRoutine
          }
          onClick={complete || memberName !== myName ? null : openProveModal}
        >
          <div className={styles.cardContent}>
            <div>🌱</div>
            <div>
              {complete
                ? `${doneAt.substring(11, 16)}에 완료!`
                : startTime === "00:00:00" && endTime === "23:59:00"
                ? "하루종일"
                : startTime.substring(0, 5)}
            </div>
            <div className="ms-auto">{routineName}</div>
          </div>
        </Card>
      </div>
      <Modal show={proveModalShow} centered>
        <Form onSubmit={submitPatch}>
          <Modal.Header className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              🌱 {routineName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <div className={styles.dayOfWeek}>
              <div className={styles.modalBodyTitle}>🌱 실천 요일</div>
              <ButtonGroup className={styles.dayOfWeekGroup}>
                <Button className={styles.dayOfWeekBtn}>월</Button>
                <Button className={styles.dayOfWeekBtn}>화</Button>
                <Button className={styles.dayOfWeekBtn}>수</Button>
                <Button className={styles.dayOfWeekBtn}>목</Button>
                <Button className={styles.dayOfWeekBtn}>금</Button>
                <Button className={styles.dayOfWeekBtn}>토</Button>
                <Button className={styles.dayOfWeekBtn}>일</Button>
              </ButtonGroup>
            </div>
            <div className={styles.actionTime}>
              <div className={styles.modalBodyTitle}>🌱 실천 시간</div>
              <InputGroup>
                <Form.Control type="time" value={startTime} disabled />
                <Form.Control type="time" value={endTime} disabled />
              </InputGroup>
            </div>
            <div className={styles.certification}>
              <div className={styles.modalBodyTitle}>🌱 인증 방법</div>
              <Card className={styles.certificationCard}>
                <Card.Body>
                  <Card.Text className={styles.certificationCardContent}>
                    {certification}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className={styles.imageSelect}>
              <div className={styles.modalBodyTitle}>🌱 인증 사진</div>
              <Form.Control
                type="file"
                accept="image/jpeg, image/png, image/heic"
                onChange={uploadedFile}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button type="button" variant="secondary" onClick={closeProveModal}>
              닫기
            </Button>
            <Button
              className={styles.submitBtn}
              type="submit"
              onClick={objToJson}
              disabled={!isValid}
            >
              인증하기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

TodayRoutine.propTypes = {
  routineId: PropTypes.number.isRequired,
  routineName: PropTypes.string.isRequired,
  memberName: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  doneAt: PropTypes.string,
  setToReload: PropTypes.func.isRequired,
};

export default TodayRoutine;
