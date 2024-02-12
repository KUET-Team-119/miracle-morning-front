import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/RoutineCalendar.css";
import moment from "moment";
import useAxiosGet from "../hook/useAxiosGet";
import useDecodingJwt from "../hook/useDecodingJwt";
import TodayResult from "./TodayResult";

function RoutineCalendar() {
  const { myId } = useDecodingJwt();
  const [date, setDate] = useState(new Date()); // 초기값은 현재 날짜
  const [response, setResponse] = useState([]);
  const [searchYear, setSearchYear] = useState("");
  const [searchMonth, setSearchMonth] = useState("");

  // 특정 기간의 기록 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/results`,
    params: { "member-id": myId, year: 2024, month: 2 },
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponse(responseData);
      } else {
        // console.log(error);
      }
    }
  }, [responseData, error, isLoading]);

  // 임시 데이터
  const dayList = [
    "2024-01-02",
    "2024-01-10",
    "2024-01-14",
    "2024-01-15",
    "2024-01-16",
  ];
  const addContent = ({ date }) => {
    const contents = [];
    if (dayList.find((day) => day === moment(date).format("YYYY-MM-DD"))) {
      contents.push(
        <div>
          <h5>good</h5>
        </div>
      );
    }
    return <div>{contents}</div>;
  };

  return (
    <div>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={addContent}
        next2Label={null}
        prev2Label={null}
        maxDate={new Date()}
        minDate={new Date("2024-01-01")}
      />
      <div>{moment(date).format("YYYY년 MM월 DD일")}</div>
      <div
        style={{
          maxHeight: "240px",
          overflowY: "auto",
          backgroundColor: "#D9D9D9",
        }}
      >
        <div className="d-flex flex-column justify-content-center">
          {response.map((result) => (
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
  );
}

export default RoutineCalendar;
