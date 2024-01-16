import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/RoutineCalendar.css";
import moment from "moment";

function RoutineCalendar() {
  const [value, onChange] = useState(new Date()); // 초기값은 현재 날짜

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
        onChange={onChange}
        value={value}
        tileContent={addContent}
        next2Label={null}
        prev2Label={null}
        maxDate={new Date()}
        minDate={new Date("2021-01-01")}
      />
      <div>{moment(value).format("YYYY년 MM월 DD일")}</div>
    </div>
  );
}

export default RoutineCalendar;
