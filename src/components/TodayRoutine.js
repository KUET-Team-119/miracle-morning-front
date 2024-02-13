import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  InputGroup,
  Modal,
  Stack,
} from "react-bootstrap";
import useDecodingJwt from "../hook/useDecodingJwt";
import styles from "../css/TodayRoutine.module.css";

function TodayRoutine({
  routineId,
  routineName,
  memberName,
  strategy,
  certification,
  startTime,
  endTime,
  complete,
  doneAt,
  setToReload,
}) {
  const { myName } = useDecodingJwt();
  const [proveModalShow, setProveModalShow] = useState(false);
  const [infoModalShow, setInfoModalShow] = useState(false);
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [fileYear, setFileYear] = useState("");
  const [fileMonth, setFileMonth] = useState("");
  const [fileDay, setFileDay] = useState("");
  const [fileTime, setFileTime] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {}, []);

  const objToJson = () => {
    setData(
      JSON.stringify({
        routineName: routineName,
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
    setInfoModalShow(false);
  };

  return (
    <>
      <Card
        body
        className={`${
          complete ? styles.completeRoutine : styles.incompleteRoutine
        } d-flex justify-content-center`}
        onClick={complete || memberName !== myName ? null : openProveModal}
        style={{ height: 48 }}
      >
        <div className="d-flex justify-content-start">
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
      <Modal show={proveModalShow} centered>
        <Form onSubmit={submitPatch}>
          <Modal.Header className="d-flex justify-content-center">
            <Modal.Title className="text-center" style={{ fontSize: 20 }}>
              🌱 {routineName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <div>
                <div>🌱 실천 요일</div>
                <ButtonGroup
                  className="d-flex"
                  style={{
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#8EC952",
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    월
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    화
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    수
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    목
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    금
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    토
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    일
                  </Button>
                </ButtonGroup>
              </div>
              <div>
                <div>🌱 실천 시간</div>
                <InputGroup>
                  <Form.Control type="time" value={startTime} disabled />
                  <Form.Control type="time" value={endTime} disabled />
                </InputGroup>
              </div>
              <div>
                <div>🌱 인증 방법</div>
                <Card
                  style={{
                    background: "#E4F6D2",
                    border: "none",
                  }}
                >
                  <Card.Body>
                    <Card.Text>{certification}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <Form.Control
                type="file"
                onChange={uploadedFile}
                onClick={() => {
                  setInfoModalShow(true);
                }}
              />
            </Stack>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button type="button" variant="secondary" onClick={closeProveModal}>
              닫기
            </Button>
            <Button
              type="submit"
              onClick={objToJson}
              disabled={!isValid}
              style={{ backgroundColor: "#8EC952", borderColor: "#8EC952" }}
            >
              인증하기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* TODO 아래 모달이 사용상 불편하지 않은지 확인하기 */}
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={infoModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>🌱 사진을 업로드 해주세요</p>
          <p>인증 사진 업로드 후 인증이 가능합니다.</p>
          <Button
            onClick={() => setInfoModalShow(false)}
            style={{ backgroundColor: "#8EC952", border: "none" }}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

TodayRoutine.propTypes = {
  routineId: PropTypes.number.isRequired,
  routineName: PropTypes.string.isRequired,
  strategy: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  setToReload: PropTypes.func.isRequired,
};

export default TodayRoutine;
