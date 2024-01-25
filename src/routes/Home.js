import TodayRoutine from "../components/TodayRoutine";
import { useEffect, useState } from "react";
import useAxiosGet from "../hook/useAxiosGet";
import useDecodingJwt from "../hook/useDecodingJwt";
import { Stack, Spinner, Container, Button, Row } from "react-bootstrap";

function Home() {
  const who = useDecodingJwt();
  const [response, setResponse] = useState([]);
  const [routinesCount, setRoutinesCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState(who);

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
          if (a === who) {
            return -1; // 사용자가 맨 앞으로 오도록 정렬
          } else if (b === "temp") {
            return 1; // 사용자가 맨 앞으로 오도록 정렬
          } else {
            return 0; // 그 외 정렬하지 않음
          }
        });
        setMembers(memberList);

        const myData = responseData.filter((obj) => obj.memberName === who);

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
      <Stack gap={1}>
        <Container>
          <Stack>
            <h4>안녕하세요 {who}님!</h4>
            <p>오늘도 좋은 하루 보내세요~</p>
          </Stack>
        </Container>
        <Container>
          <Row className="justify-content-center">
            {isLoading ? (
              <Spinner animation="border" />
            ) : (
              <Container>
                {}
                {console.log(members)}
                <p>
                  {routinesCount === 0
                    ? "모든 목표를 이뤘어요. 정말 최고에요!"
                    : `완벽한 하루까지 ${routinesCount}개의 루틴이 남았어요`}
                </p>
                {members.map((member) => (
                  <Button
                    key={member}
                    value={member}
                    onClick={() => setMemberName(member)}
                    style={{ marginRight: "4px", marginBottom: "4px" }}
                  >
                    {member === who ? "내 루틴" : member}
                  </Button>
                ))}
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
                    complete={routine.complete}
                    setToReload={refetch}
                  />
                ))}
              </Container>
            )}
          </Row>
        </Container>
      </Stack>
    </>
  );
}

export default Home;
