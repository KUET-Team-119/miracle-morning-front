import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup, Modal, Stack } from "react-bootstrap";
import useDecodingJwt from "../hook/useDecodingJwt";

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
      const response = await axios.patch(`/api/result`, formData, {
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
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const timeOnly = fileTime.substring(11, 19);

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
      <Card
        body
        onClick={complete || memberName !== myName ? null : openProveModal}
        border={complete ? "success" : "dark"}
        style={{ marginBottom: "10px" }}
      >
        <Stack direction="horizontal" gap={3}>
          <div>💚</div>
          <div>
            {startTime.substring(0, 5)} ~ {endTime.substring(0, 5)}
          </div>
          <div>{doneAt}</div>
          <div className="ms-auto">{routineName}</div>
        </Stack>
      </Card>
      <Modal show={proveModalShow}>
        <Form onSubmit={submitPatch}>
          <Modal.Header>
            <Modal.Title>{routineName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <div>
                ⏰ {startTime.substring(0, 5)} ~ {endTime.substring(0, 5)}
              </div>
              <div>📸 "{certification}"으로 인증해주세요!</div>
              <Form.Control type="file" onChange={uploadedFile} />
              <InputGroup>
                <InputGroup.Text>사진 시간</InputGroup.Text>
                <Form.Control value={fileTime} readOnly />
              </InputGroup>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={closeProveModal}>
              취소
            </Button>
            <Button type="submit" onClick={objToJson} disabled={!isValid}>
              확인
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
  strategy: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  setToReload: PropTypes.func.isRequired,
};

export default TodayRoutine;
