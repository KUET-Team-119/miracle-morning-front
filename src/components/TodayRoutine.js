import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import imageCompression from "browser-image-compression";
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

// 파일 유효성 상태
const VALIDATE_FILE = 0;
const INVALID_DATE = 1;
const INVALID_TIME = 2;
const INVALID_SIZE = 3;
const NOT_SELECTED = 4;
const COMPRESSION_ERROR = 5;

function TodayRoutine({
  resultId,
  routineName,
  memberName,
  dayOfWeek,
  certification,
  startTime,
  endTime,
  complete,
  doneAt,
  setToReload,
}) {
  const { myName } = useDecodingJwt();
  const [proveModalShow, setProveModalShow] = useState(false);
  const [cancelProveModalShow, setCancelProveModalShow] = useState(false);
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [fileTime, setFileTime] = useState("");
  const [isProveClicked, setIsProveClicked] = useState(false);
  const [isCancelClicked, setIsCancelClicked] = useState(false);
  const [isValid, setIsValid] = useState(NOT_SELECTED);
  const [modalNotice, setModalNotice] =
    useState("※ 오늘 날짜의 사진을 선택하세요");
  const navigate = useNavigate();

  const objToJson = () => {
    setData(
      JSON.stringify({
        resultId: resultId,
        routineName: routineName,
        doneAt: fileTime === "" ? null : fileTime,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPatch = (e) => {
    e.preventDefault();
    setIsProveClicked(true);
    setIsCancelClicked(true);
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
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      setToReload(); // GET 메소드 재호출 유도
      closeProveModal();
      closeCancelProveModal();
    } catch (error) {
      const status = error.response.status;
      if (status === 401) {
        const authorizationHeader = error.response.headers.authorization;

        // Authorization 헤더가 있는지 확인
        if (authorizationHeader) {
          // 새로운 accessToken 토큰을 추출
          const accessToken = authorizationHeader.split("Bearer ")[1];
          localStorage.setItem("access-token", accessToken);

          try {
            const response = await axios.patch(`/api/results`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
            });
            setToReload(); // GET 메소드 재호출 유도
            closeProveModal();
            closeCancelProveModal();
          } catch (error) {
            closeProveModal();
            closeCancelProveModal();
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
        } else {
          closeProveModal();
          closeCancelProveModal();
          navigate("/unauthorized");
        }
      } else {
        closeProveModal();
        closeCancelProveModal();
        if (status === 403) {
          navigate("/forbidden");
        } else if (status === 404) {
          navigate("/not-found");
        } else {
          navigate("/server-error");
        }
      }
    }
  };

  const uploadedFile = async (e) => {
    const fileData = e.target.files[0];
    const options = {
      maxSizeMB: 0.3, // 이미지 최대 용량
      useWebWorker: true,
    };

    // 파일이 선택되어야 함
    if (fileData !== undefined && fileData !== null) {
      try {
        // 파일 유효성 검사
        const validationResult = validateFile(fileData);
        if (validationResult.isValid) {
          // 파일이 유효하면 압축 진행
          await compressFile(fileData, options);
          setIsValid(VALIDATE_FILE);
        } else {
          // 파일이 유효하지 않으면 에러 처리
          handleValidationErrors(validationResult.errorType);
        }
      } catch (error) {
        console.log(error);
        handleCompressionError();
      }
    } else {
      // 파일이 선택되지 않았을 때
      handleFileNotSelected();
    }
  };

  const validateFile = (fileData) => {
    const fileSizeLimit = 5242880; // 5MB

    const fileSize = fileData.size;
    const lastModifiedTimestamp = fileData.lastModified;
    const fileDateObj = new Date(lastModifiedTimestamp);
    const fileYear = fileDateObj.getFullYear();
    let fileMonth = fileDateObj.getMonth();
    let fileDay = fileDateObj.getDate();
    let fileHours = fileDateObj.getHours();
    let fileMinutes = fileDateObj.getMinutes();
    console.log(fileYear);
    console.log(fileMonth);
    console.log(fileDay);
    console.log(fileHours);
    console.log(fileMinutes);

    // 파일 크기 확인
    if (fileSize > fileSizeLimit) {
      return { isValid: false, errorType: "INVALID_SIZE" };
    }

    // 오늘 날짜 확인
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    if (
      fileYear !== todayYear ||
      fileMonth !== todayMonth ||
      fileDay !== todayDay
    ) {
      return { isValid: false, errorType: "INVALID_DATE" };
    }

    // 시간 확인
    if (fileDay <= 9) {
      fileDay = "0" + fileDay;
    }
    if (fileHours <= 9) {
      fileHours = "0" + fileHours;
    }
    if (fileMinutes <= 9) {
      fileMinutes = "0" + fileMinutes;
    }
    const fileTime = fileHours + ":" + fileMinutes + ":00";
    console.log(fileTime);
    console.log(endTime);
    if (fileTime > endTime) {
      return { isValid: false, errorType: "INVALID_TIME" };
    }

    if (fileMonth + 1 <= 9) {
      fileMonth = "0" + (fileMonth + 1);
    }
    setFileTime(
      `${fileYear}-${fileMonth}-${fileDay}T${fileHours}:${fileMinutes}:00`
    );

    return { isValid: true };
  };

  const compressFile = async (fileData, options) => {
    setIsValid(INVALID_DATE);
    setModalNotice("※ 파일을 분석 중입니다. 이 작업은 시간이 약간 소요됩니다.");
    const compressedFile = await imageCompression(fileData, options);
    setFile(compressedFile);
  };

  const handleValidationErrors = (errorType) => {
    switch (errorType) {
      case "INVALID_SIZE":
        setIsValid(INVALID_SIZE);
        setModalNotice("※ 사진 크기가 5MB 이하여야 합니다");
        break;
      case "INVALID_TIME":
        setIsValid(INVALID_TIME);
        setModalNotice("※ 실천 시간 내에 촬영한 사진을 선택하세요");
        break;
      case "INVALID_DATE":
        setIsValid(INVALID_DATE);
        setModalNotice("※ 오늘 날짜의 사진을 선택하세요");
        break;
      default:
        setModalNotice("※ 파일 분석 중 오류가 발생했습니다. 다시 시도해주세요");
        break;
    }
  };

  const handleCompressionError = () => {
    setFile(null);
    setIsValid(COMPRESSION_ERROR);
    setModalNotice("※ 파일 분석 중 오류가 발생했습니다. 다시 시도해주세요");
  };

  const handleFileNotSelected = () => {
    setFile(null);
    setIsValid(NOT_SELECTED);
    setModalNotice("※ 오늘 날짜의 사진을 선택하세요");
  };

  // 인증 모달 열기
  const openProveModal = () => {
    setProveModalShow(true);
  };

  // 인증 모달 닫기
  const closeProveModal = () => {
    setProveModalShow(false);
    setFile(null); // 파일 상태 초기화
    setFileTime("");
    setIsValid(NOT_SELECTED);
    setModalNotice("※ 오늘 날짜의 사진을 선택하세요");
    setIsProveClicked(false);
  };

  // 인증 취소 모달 열기
  const openCancelProveModal = () => {
    objToJson();
    setCancelProveModalShow(true);
  };

  // 인증 취소 모달 닫기
  const closeCancelProveModal = () => {
    setCancelProveModalShow(false);
    setIsCancelClicked(false);
  };

  return (
    <>
      <div className={styles.container}>
        <Card
          body
          className={
            complete ? styles.completeRoutine : styles.incompleteRoutine
          }
          onClick={
            memberName === myName
              ? complete
                ? openCancelProveModal
                : openProveModal
              : null
          }
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
              {dayOfWeek === "1111111" ? (
                <ButtonGroup className={styles.dayOfWeekGroup}>
                  <Button className={styles.selectedEveryDayBtn} disabled>
                    매일
                  </Button>{" "}
                </ButtonGroup>
              ) : (
                <ButtonGroup className={styles.dayOfWeekGroup}>
                  <Button
                    className={
                      dayOfWeek.substring(0, 1) === "0"
                        ? styles.dayOfWeekBtn
                        : styles.selectedDayOfWeekBtn
                    }
                    disabled
                  >
                    월
                  </Button>
                  <Button
                    className={
                      dayOfWeek.substring(1, 2) === "0"
                        ? styles.dayOfWeekBtn
                        : styles.selectedDayOfWeekBtn
                    }
                    disabled
                  >
                    화
                  </Button>
                  <Button
                    className={
                      dayOfWeek.substring(2, 3) === "0"
                        ? styles.dayOfWeekBtn
                        : styles.selectedDayOfWeekBtn
                    }
                    disabled
                  >
                    수
                  </Button>
                  <Button
                    className={
                      dayOfWeek.substring(3, 4) === "0"
                        ? styles.dayOfWeekBtn
                        : styles.selectedDayOfWeekBtn
                    }
                    disabled
                  >
                    목
                  </Button>
                  <Button
                    className={
                      dayOfWeek.substring(4, 5) === "0"
                        ? styles.dayOfWeekBtn
                        : styles.selectedDayOfWeekBtn
                    }
                    disabled
                  >
                    금
                  </Button>
                  <Button
                    className={
                      dayOfWeek.substring(5, 6) === "0"
                        ? styles.dayOfWeekBtn
                        : styles.selectedDayOfWeekBtn
                    }
                    disabled
                  >
                    토
                  </Button>
                  <Button
                    className={
                      dayOfWeek.substring(6) === "0"
                        ? styles.dayOfWeekBtn
                        : styles.selectedDayOfWeekBtn
                    }
                    disabled
                  >
                    일
                  </Button>
                </ButtonGroup>
              )}
            </div>
            <div className={styles.actionTime}>
              <div className={styles.modalBodyTitle}>🌱 실천 시간</div>
              <InputGroup>
                <Form.Control type="time" value={startTime} disabled />
                <InputGroup.Text>~</InputGroup.Text>
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
              {isValid !== VALIDATE_FILE ? (
                <div className={styles.modalNotice}>{modalNotice}</div>
              ) : null}
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
              disabled={isValid !== VALIDATE_FILE || isProveClicked}
            >
              인증하기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={cancelProveModalShow} centered>
        <Modal.Body className={styles.cancelProveModalBody}>
          <p className={styles.cancelProveModalBodyTitle}>인증을 취소할까요?</p>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={closeCancelProveModal}>
            취소
          </Button>
          <Button
            onClick={submitPatch}
            variant="danger"
            disabled={isCancelClicked}
          >
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

TodayRoutine.propTypes = {
  resultId: PropTypes.number.isRequired,
  routineName: PropTypes.string.isRequired,
  memberName: PropTypes.string.isRequired,
  dayOfWeek: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  doneAt: PropTypes.string,
  setToReload: PropTypes.func.isRequired,
};

export default TodayRoutine;
