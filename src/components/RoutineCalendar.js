import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import useAxiosGet from "../hook/useAxiosGet";
import useDecodingJwt from "../hook/useDecodingJwt";
import TodayResult from "./TodayResult";
import { Spinner } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import "../css/RoutineCalendar.css";
import styles from "../css/RoutineCalendar.module.css";
import crownIcon from "../images/crown.png";

function RoutineCalendar() {
  const { myId } = useDecodingJwt();
  const [date, setDate] = useState(new Date()); // 초기값은 현재 날짜
  const [response, setResponse] = useState([]);
  const [targetDateData, setTargetDateData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [searchYear, setSearchYear] = useState(
    moment(new Date()).format("YYYY")
  );
  const [searchMonth, setSearchMonth] = useState(
    moment(new Date()).format("M")
  );

  // 특정 기간의 기록 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/results`,
    params: { "member-id": myId, year: searchYear, month: searchMonth },
  });

  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponse(responseData);
        console.log(responseData);
      } else {
        // console.log(error);
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

      return (
        <div className={styles.tileContent}>
          <div className={styles.tileCircle} />
          <div className={styles.tileText}>
            {`${doneCount} | ${totalCount}`}
          </div>
          {doneCount === totalCount ? (
            <img className={styles.tileCrown} src={crownIcon} alt="왕관" />
          ) : null}
        </div>
      );
    } else {
      return null; // 오늘 이후의 날짜는 반환하지 않음
    }
  };

  // totalCount와 doneCount 업데이트
  useEffect(() => {
    if (response.length > 0) {
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
        <div>
          <Calendar
            onChange={setDate}
            onActiveStartDateChange={setMonth}
            value={date}
            tileContent={addContent}
            next2Label={null}
            prev2Label={null}
            maxDate={new Date()}
            minDate={new Date("2024-01-01")}
            minDetail={"month"}
            formatDay={(locale, date) => moment(date).format("D")}
            showNeighboringMonth={false}
          />
          <div className={styles.resultsContainer}>
            <div className={styles.resultsContainerTitle}>
              <div className={styles.targetDate}>
                {moment(date).format("MM/DD")}
              </div>
              <div>
                {totalCount}개 중에{" "}
                <span className={styles.doneCount}>{doneCount}개</span> 루틴을
                달성했어요!
              </div>
              {doneCount === totalCount ? (
                <img className={styles.crown} src={crownIcon} alt="왕관" />
              ) : null}
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
