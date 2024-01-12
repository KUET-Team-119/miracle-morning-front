import PropTypes from "prop-types";

function TodayRoutineItem({
  routineId,
  routineName,
  strategy,
  certification,
  startTime,
  endTime,
}) {
  return (
    <div>
      <div className="container">
        <h3>루틴명: {routineName}</h3>
        <p>실천전략: {strategy}</p>
        <p>인증방법: {certification}</p>
        <p>시작시간: {startTime}</p>
        <p>종료시간: {endTime}</p>
      </div>
    </div>
  );
}

TodayRoutineItem.propTypes = {
  routineId: PropTypes.number.isRequired,
  routineName: PropTypes.string.isRequired,
  strategy: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
};

export default TodayRoutineItem;
