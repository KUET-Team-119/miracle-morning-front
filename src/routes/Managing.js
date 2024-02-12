import MyRoutine from "../components/MyRoutine";
import { useEffect, useState } from "react";
import useAxiosGet from "../hook/useAxiosGet";
import useAxiosPost from "../hook/useAxiosPost";
import useDecodingJwt from "../hook/useDecodingJwt";
import {
  Button,
  Container,
  Spinner,
  Stack,
  Modal,
  Form,
  InputGroup,
  ButtonGroup,
  Row,
} from "react-bootstrap";
import Menu from "../components/Offcanvas";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";
import addIcon from "../images/add.png";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
      <Menu
        show={menuShow}
        onHide={() => {
          setMenuShow(false);
        }}
      />
      <Stack gap={1}>
        <Container
          className="d-flex justify-content-center align-items-start"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          <div>
            <p style={{ padding: 0, margin: 0 }}>
              <span style={{ color: "#69973A" }}>{myName}</span>님의 루틴 List🌱
            </p>
          </div>
          <img
            className="ms-auto"
            src={homeIcon}
            onClick={goToHome}
            alt="홈"
            style={{ width: 24, height: 24, marginRight: 12 }}
          ></img>
          <img
            src={menuIcon}
            onClick={() => {
              setMenuShow(true);
            }}
            alt="메뉴"
            style={{ width: 24, marginRight: 12 }}
          ></img>
        </Container>
        <Container
          style={{
            borderRadius: "12px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#8EC952",
            padding: "16px",
          }}
        >
          <Container className="d-flex justify-content-between align-items-start">
            <p>🌱 수정하고 싶은 루틴을 클릭해요</p>
            <img
              src={addIcon}
              className="ms-auto rounded-circle"
              onClick={openAddModal}
              width={32}
              height={32}
              alt="추가"
            />
          </Container>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Container>
              <Row className="justify-content-center">
                {isLoading ? (
                  <Spinner animation="border" />
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
              </Row>
            </Container>
          </div>
        </Container>
      </Stack>
      <Modal show={addModalShow} centered>
        <Form onSubmit={submitPost}>
          <Modal.Body>
            <Stack gap={3}>
              <div>
                <div>🌱 루틴명</div>
                <Form.Control
                  type="text"
                  value={newRoutineName}
                  placeholder="10자 이내"
                  onChange={changeRoutineName}
                  maxLength={10}
                />
                <div style={{ fontSize: 12, marginTop: 2, marginLeft: 4 }}>
                  루틴명은 변경이 불가능해요.
                </div>
              </div>
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
                <div style={{ fontSize: 12, marginTop: 2, marginLeft: 4 }}>
                  자유롭게 요일을 선택할 수 있어요.
                </div>
              </div>
              <div>
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
                <div className="d-flex justify-content-start align-items-center">
                  <span style={{ fontSize: 12, marginTop: 2, marginLeft: 4 }}>
                    하루종일
                  </span>
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={changeAllDay}
                    style={{
                      width: 16,
                      height: 16,
                      display: "inline-block",
                      marginTop: 2,
                      marginLeft: 4,
                      accentColor: "#8EC952",
                    }}
                  />
                </div>
              </div>
              <div>
                <div>🌱 실천 전략</div>
                <Form.Control
                  type="text"
                  value={newStrategy}
                  placeholder="(20자 이내)"
                  maxLength={20}
                  onChange={changeStrategy}
                />
              </div>
              <div>
                <div>🌱 인증 방법</div>
                <Form.Control
                  type="text"
                  value={newCertification}
                  placeholder="ex) 물이 따라진 컵 사진 촬영(20자 이내)"
                  maxLength={20}
                  onChange={changeCertification}
                />
              </div>
            </Stack>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Button type="button" variant="secondary" onClick={closeAddModal}>
              닫기
            </Button>
            <Button
              type="submit"
              disabled={isValid ? false : true}
              onClick={objToJson}
              style={{
                backgroundColor: "#8EC952",
                borderColor: "#8EC952",
              }}
            >
              만들기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={errorModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>⛔ 중복된 루틴입니다.</p>
          <p>다른 루틴명을 입력해주세요.</p>
          <Button
            variant="primary"
            onClick={() => setErrorModalShow(false)}
            style={{ backgroundColor: "#8EC952", border: "none" }}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Managing;
