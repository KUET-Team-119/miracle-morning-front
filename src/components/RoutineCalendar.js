import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/RoutineCalendar.css";
import moment from "moment";
import useAxiosGet from "../hook/useAxiosGet";
import useDecodingJwt from "../hook/useDecodingJwt";
import TodayResult from "./TodayResult";
import { Spinner } from "react-bootstrap";

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
        <div style={{ position: "relative", width: 48, height: 48 }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#ECFADD",
              color: "black",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 12,
            }}
          >
            {`${doneCount} | ${totalCount}`}
          </div>
        </div>
      );
    } else {
      return null; // 오늘 이후의 날짜는 아무 것도 반환하지 않음
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
    <div>
      <div className="d-flex justify-content-center">
        {isLoading ? (
          <Spinner animation="border" />
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
            <div
              style={{
                maxHeight: "240px",
                overflowY: "auto",
                backgroundColor: "#F3F3F3",
              }}
            >
              <div className="d-flex justify-content-start">
                <div style={{ marginRight: 4 }}>
                  {moment(date).format("MM/DD")}
                </div>
                <div>
                  {totalCount}개 중에 {doneCount}개 루틴을 달성했어요
                </div>
              </div>
              <div className="d-flex flex-column justify-content-center">
                {targetDateData.map((result) => (
                  <TodayResult
                    key={result.resultId}
                    resultId={result.resultId}
                    routineName={result.routineName}
                    createdAt={result.createdAt}
                    doneAt={result.doneAt}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoutineCalendar;
