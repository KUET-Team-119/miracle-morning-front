import TodayRoutine from "../components/TodayRoutine";
import { useEffect, useState } from "react";
import useAxiosGet from "../hook/useAxiosGet";
import useDecodingJwt from "../hook/useDecodingJwt";
import { Stack, Spinner, Container, Card, Row } from "react-bootstrap";
import Menu from "../components/Offcanvas";
import menuIcon from "../images/menu.png";
import Profile from "../components/Profile";

function Home() {
  const { myName } = useDecodingJwt();
  const [response, setResponse] = useState([]);
  const [routinesCount, setRoutinesCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState(myName);
  const [menuShow, setMenuShow] = useState(false);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  let todayWeekOfDay = today.getDay();

  switch (todayWeekOfDay) {
    case 1:
      todayWeekOfDay = "월";
      break;
    case 2:
      todayWeekOfDay = "화";
      break;
    case 3:
      todayWeekOfDay = "수";
      break;
    case 4:
      todayWeekOfDay = "목";
      break;
    case 5:
      todayWeekOfDay = "금";
      break;
    case 6:
      todayWeekOfDay = "토";
      break;
    case 7:
      todayWeekOfDay = "일";
      break;
    default:
      break;
  }

  // 오늘의 루틴 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/all/routines/today`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        const memberList = [
          ...new Set(responseData.map((obj) => obj.memberName)),
        ].sort((a, b) => {
          if (a === myName) {
            return -1; // 사용자가 맨 앞으로 오도록 정렬
          } else if (b === myName) {
            return 1; // 사용자가 맨 앞으로 오도록 정렬
          } else {
            return 0; // 그 외 정렬하지 않음
          }
        });
        setMembers(memberList);

        const myData = responseData.filter((obj) => obj.memberName === myName);

        const filteredData = responseData.filter(
          (obj) => obj.memberName === memberName
        );

        let count = 0;
        for (const item of myData) {
          if (!item.complete) {
            count++;
          }
        }
        setRoutinesCount(count);
        const sortedResponseData = [...filteredData]; // 복사본을 만들어 정렬
        sortedResponseData.sort((a, b) => {
          // complete가 false인 경우를 먼저 정렬, true인 경우는 나중에 정렬
          if (a.complete === b.complete) {
            // complete 값이 같은 경우 startTime으로 정렬
            return a.startTime.localeCompare(b.startTime);
          } else {
            return a.complete ? 1 : -1; // false가 앞에 오도록 정렬
          }
        });
        setResponse(sortedResponseData);
        // console.log(sortedResponseData);
      } else {
        // console.log(error);
      }
    }
  }, [responseData, error, isLoading, memberName]);

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
              안녕하세요 <span style={{ color: "#69973A" }}>{myName}</span>님!
            </p>
            <p style={{ padding: 0, margin: 0 }}>오늘도 좋은 하루 보내세요🌱</p>
          </div>
          <img
            className="ms-auto"
            src={menuIcon}
            onClick={() => {
              setMenuShow(true);
            }}
            alt="메뉴"
            style={{ width: 24, height: 24, marginRight: 12 }}
          ></img>
        </Container>
        <Container>
          <Row className="justify-content-center">
            {isLoading ? (
              <Spinner animation="border" />
            ) : (
              <Container>
                <Card
                  className="text-center"
                  style={{
                    marginBottom: 24,
                    background: "#E4F6D2",
                    border: "none",
                  }}
                >
                  <Card.Body>
                    <Card.Text>
                      {routinesCount === 0 ? (
                        "모든 루틴을 달성했어요! 내일도 화이팅🔥"
                      ) : (
                        <>
                          완벽한 하루까지{" "}
                          <span style={{ color: "#69973A" }}>
                            {routinesCount}개
                          </span>
                          의 루틴이 남아있어요
                        </>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Stack direction="horizontal">
                  {members.map((member) => (
                    <Profile
                      key={member}
                      name={member}
                      selected={memberName}
                      setMemberRoutines={() => setMemberName(member)}
                    />
                  ))}
                </Stack>
                <Container
                  style={{
                    borderRadius: "12px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: "#8EC952",
                    padding: "16px",
                  }}
                >
                  <p style={{ textAlign: "center" }}>
                    <span style={{ color: "#69973A" }}>{memberName}</span>
                    님의{" "}
                    {`${todayYear}년 ${
                      todayMonth + 1
                    }월 ${todayDay}일 (${todayWeekOfDay})`}
                  </p>
                  <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                    <div className="d-flex flex-column justify-content-center">
                      {response.map((routine) => (
                        <TodayRoutine
                          key={routine.routineId}
                          routineId={routine.routineId}
                          routineName={routine.routineName}
                          memberName={routine.memberName}
                          strategy={routine.strategy}
                          certification={routine.certification}
                          startTime={routine.startTime}
                          endTime={routine.endTime}
                          doneAt={routine.doneAt}
                          complete={routine.complete}
                          setToReload={refetch}
                        />
                      ))}
                    </div>
                  </div>
                </Container>
              </Container>
            )}
          </Row>
        </Container>
      </Stack>
    </>
  );
}

export default Home;
