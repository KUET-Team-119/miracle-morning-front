import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAxiosGet from "../hook/useAxiosGet";
import useDecodingJwt from "../hook/useDecodingJwt";
import Menu from "../components/Menu";
import Profile from "../components/Profile";
import TodayRoutine from "../components/TodayRoutine";
import { Spinner, Card, Button } from "react-bootstrap";
import styles from "../css/Home.module.css";
import menuIcon from "../images/menu.png";

function Home() {
  const { myName } = useDecodingJwt();
  const [response, setResponse] = useState([]);
  const [routinesCount, setRoutinesCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState(myName);
  const [menuShow, setMenuShow] = useState(false);
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeekIndex = moment().format("d"); // 오늘의 요일을 숫자로 얻기
  const dayOfWeek = daysOfWeek[dayOfWeekIndex]; // 숫자에 해당하는 요일 문자열 가져오기
  const navigate = useNavigate();

  const goToRoutines = () => {
    navigate("/routines");
  };

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
            if (a.startTime === b.startTime) {
              // startTime이 같은 경우 endTime으로 정렬
              return a.endTime.localeCompare(b.endTime);
            } else {
              return a.startTime.localeCompare(b.startTime);
            }
          } else {
            return a.complete ? 1 : -1; // false가 앞에 오도록 정렬
          }
        });
        setResponse(sortedResponseData);
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
  }, [responseData, error, isLoading, memberName]);

  return (
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
              안녕하세요 <span>{myName}</span>님!
            </p>
            <p>오늘도 좋은 하루 보내세요🌱</p>
          </div>
          <div className={styles.headerIcon}>
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
      <div className={styles.contents}>
        {isLoading ? (
          <div className={styles.spinner}>
            <Spinner animation="border" />
          </div>
        ) : (
          <div>
            <Card className={styles.goalCard} body>
              {routinesCount === 0 ? (
                <div className={styles.cheering}>
                  모든 루틴을 달성했어요! 내일도 화이팅🔥
                </div>
              ) : (
                <div className={styles.cheering}>
                  완벽한 하루까지 <span>{routinesCount}개</span>의 루틴이
                  남았어요
                </div>
              )}
            </Card>
            <div className={styles.membersList}>
              {members.map((member) => (
                <Profile
                  key={member}
                  name={member}
                  selected={memberName}
                  setMemberRoutines={() => setMemberName(member)}
                />
              ))}
            </div>
            <div className={styles.routinesContainer}>
              <p className={styles.date}>
                <span>{memberName}</span>
                님의 {`${moment().format("YYYY년 M월 D일")} (${dayOfWeek})`}
              </p>
              {response.length !== 0 ? (
                <div className={styles.routinesList}>
                  {response.map((routine) => (
                    <TodayRoutine
                      key={routine.resultId}
                      resultId={routine.resultId}
                      routineId={routine.routineId}
                      routineName={routine.routineName}
                      memberName={routine.memberName}
                      dayOfWeek={routine.dayOfWeek}
                      certification={routine.certification}
                      startTime={routine.startTime}
                      endTime={routine.endTime}
                      doneAt={routine.doneAt}
                      complete={routine.complete}
                      setToReload={refetch}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.noRoutine}>
                  <p>오늘 달성할 루틴이 없어요</p>
                  <p>루틴 관리에서 루틴을 만들어보세요</p>
                  <p>생성한 루틴은 매일 자정에 업데이트됩니다</p>
                  <Button onClick={goToRoutines}>루틴 관리로 이동</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
