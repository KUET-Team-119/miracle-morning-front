import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import moment from "moment";
import useAxiosGet from "../hook/useAxiosGet";
import useDecodingJwt from "../hook/useDecodingJwt";
import TodayResult from "./TodayResult";
import { ProgressBar, Spinner } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import "../css/RoutineCalendar.css";
import styles from "../css/RoutineCalendar.module.css";
import crownIcon from "../images/crown.png";

function RoutineCalendar() {
  const { myId } = useDecodingJwt();
  const [date, setDate] = useState(new Date()); // 초기값은 현재 날짜
  const [startDate, setStartDate] = useState(new Date());
  const [response, setResponse] = useState([]);
  const [targetDateData, setTargetDateData] = useState([]);
  const [achievementRate, setAchievementRate] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [searchYear, setSearchYear] = useState(
    moment(new Date()).format("YYYY")
  );
  const [searchMonth, setSearchMonth] = useState(
    moment(new Date()).format("M")
  );
  const navigate = useNavigate();

  // 특정 기간의 기록 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/results`,
    params: { "member-id": myId, year: searchYear, month: searchMonth },
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        // 기록 데이터가 있으면 사용자의 가입일자부터 기록 표시
        if (responseData.length !== 0) {
          setStartDate(
            moment(responseData[0].memberJoinDate).format("YYYY-MM-DD")
          );
        }

        // 데이터를 받아와서 정렬
        const sortedData = responseData.sort((a, b) => {
          if (a.doneAt && b.doneAt) {
            // doneAt이 모두 존재하는 경우
            if (a.doneAt === b.doneAt) {
              // doneAt이 같으면 routineName을 기준으로 오름차순으로 정렬
              return a.routineName.localeCompare(b.routineName, "ko-KR");
            } else {
              // doneAt이 다른 경우 doneAt을 기준으로 오름차순으로 정렬
              return a.doneAt.localeCompare(b.doneAt);
            }
          } else if (a.doneAt && !b.doneAt) {
            // a는 doneAt이 있고, b는 없는 경우 a를 먼저 정렬
            return -1;
          } else if (!a.doneAt && b.doneAt) {
            // a는 doneAt이 없고, b는 있는 경우 b를 먼저 정렬
            return 1;
          } else {
            // doneAt이 모두 없는 경우
            return 0;
          }
        });
        // 정렬된 데이터를 상태에 저장
        setResponse(sortedData);
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

  // 모든 타일에 각각의 달성 기록 표시
  const addContent = ({ date }) => {
    // 오늘 날짜 이전인 경우에만 처리
    if (
      moment(date).isBefore(moment(), "day") ||
      moment(date).isSame(moment(), "day")
    ) {
      const totalCount = response.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return (
          createdAt.getFullYear() === date.getFullYear() &&
          createdAt.getMonth() === date.getMonth() &&
          createdAt.getDate() === date.getDate()
        );
      }).length;

      const doneCount = response.filter(
        (item) =>
          moment(item.createdAt).isSame(date, "day") && item.doneAt !== null
      ).length;

      return totalCount !== 0 ? (
        <div className={styles.tileContent}>
          <div className={styles.tileCircle} />
          <div className={styles.tileText}>
            <span
              className={
                doneCount === totalCount
                  ? styles.tileTextCompleteDoneAt
                  : styles.tileTextIncompleteDoneAt
              }
            >{`${doneCount} `}</span>
            <span className={styles.tileTextTotal}>{` | ${totalCount}`}</span>
          </div>
          {doneCount === totalCount ? (
            <img className={styles.tileCrown} src={crownIcon} alt="왕관" />
          ) : null}
        </div>
      ) : null;
    } else {
      return null; // 오늘 이후의 날짜는 반환하지 않음
    }
  };

  // totalCount와 doneCount 업데이트
  useEffect(() => {
    if (response.length >= 0) {
      const totalCountMonth = response.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return (
          createdAt.getFullYear() === date.getFullYear() &&
          createdAt.getMonth() === date.getMonth()
        );
      }).length;

      const doneCountMonth = response.filter(
        (item) =>
          moment(item.createdAt).isSame(date, "month") && item.doneAt !== null
      ).length;

      if (isNaN(doneCountMonth / totalCountMonth)) {
        setAchievementRate(0);
      } else {
        setAchievementRate(Math.ceil((doneCountMonth / totalCountMonth) * 100));
      }

      const totalCount = response.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return (
          createdAt.getFullYear() === date.getFullYear() &&
          createdAt.getMonth() === date.getMonth() &&
          createdAt.getDate() === date.getDate()
        );
      }).length;

      const doneCount = response.filter(
        (item) =>
          moment(item.createdAt).isSame(date, "day") && item.doneAt !== null
      ).length;

      setTotalCount(totalCount);
      setDoneCount(doneCount);
    }
  }, [response, date]);

  // 날짜별 루틴 표시
  useEffect(() => {
    if (response.length > 0) {
      const filteredData = response.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return (
          createdAt.getFullYear() === date.getFullYear() &&
          createdAt.getMonth() === date.getMonth() &&
          createdAt.getDate() === date.getDate()
        );
      });
      setTargetDateData(filteredData);
    }
  }, [response, date]);

  // 월 이동 시 실행
  const setMonth = (e) => {
    setSearchYear(moment(e.activeStartDate).format("YYYY"));
    setSearchMonth(moment(e.activeStartDate).format("M"));
    setDate(e.activeStartDate);
  };

  // 월 변경 시 해당하는 월의 데이터 요청
  useEffect(() => {
    // 페이지 처음 로드 시에는 실행 안 함
    if (isLoading === false) {
      refetch({
        params: { "member-id": myId, searchYear, searchMonth },
      });
    }
  }, [searchYear, searchMonth]);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" />
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.rateContainer}>
            <div>🌱전체 달성률</div>
            <ProgressBar
              className={styles.progressBar}
              now={achievementRate}
              label={`${achievementRate}%`}
            />
          </div>
          <Calendar
            onChange={setDate}
            onActiveStartDateChange={setMonth}
            value={date}
            tileContent={addContent}
            next2Label={null}
            prev2Label={null}
            maxDate={new Date()}
            minDate={new Date(startDate)}
            minDetail={"month"}
            formatDay={(locale, date) => moment(date).format("D")}
            showNeighboringMonth={false}
          />
          <div className={styles.resultsContainer}>
            <div className={styles.resultsContainerTitle}>
              <div className={styles.targetDate}>
                {moment(date).format("MM.DD.")}
              </div>
              {totalCount !== 0 ? (
                <div className={styles.resultsContainerTitleText}>
                  <div>
                    {totalCount}개 중에{" "}
                    <span className={styles.doneCount}>{doneCount}개</span>{" "}
                    루틴을 달성했어요!
                  </div>
                  {doneCount === totalCount ? (
                    <img className={styles.crown} src={crownIcon} alt="왕관" />
                  ) : null}
                </div>
              ) : (
                "기록이 없습니다!"
              )}
            </div>
            <div className={styles.resultsList}>
              {targetDateData.map((result) => (
                <TodayResult
                  key={result.resultId}
                  routineName={result.routineName}
                  doneAt={result.doneAt}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoutineCalendar;
