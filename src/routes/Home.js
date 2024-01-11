import "../css/Home.css";
import RoutineItem from "../components/RoutineItem";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [routines, setRoutines] = useState([]);

  // 특정 사용자로 하드 코딩
  const memberName = "초리";

  const getRoutines = async () => {
    try {
      const response = await axios.get(`/api/routine/${memberName}`);
      console.log(response.data);
      setRoutines(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoutines();
  }, []); // 마운트 때만 정보 가져옴 -> 변경해야 함

  return (
    <div>
      <div className="homeBody">
        <div className="homeContainer">
          <div className="header">
            <h4>
              안녕하세요 요미님!
              <br />
              오늘도 좋은 하루 보내세요~
            </h4>
            <div>
              <p>마이페이지</p>
            </div>
          </div>
          <div className="content">
            <div className="intro">
              <p>완벽한 하루까지 n개의 루틴이 남았어요</p>
            </div>
            <div className="routineContainer">
              {routines.map((routine) => (
                <RoutineItem
                  key={routine.routineId}
                  routineName={routine.routineName}
                  strategy={routine.strategy}
                  certification={routine.certification}
                  startTime={routine.startTime}
                  endTime={routine.endTime}
                />
              ))}
            </div>
          </div>
          <div className="navContainer">
            <div className="navItem">
              <h3>홈</h3>
            </div>
            <div className="navItem">
              <h3>루틴 관리</h3>
            </div>
            <div className="navItem">
              <h3>루틴 현황</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
