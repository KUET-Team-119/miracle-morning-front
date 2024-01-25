import RoutineCalendar from "../components/RoutineCalendar";
import { Link } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";
import { Container } from "react-bootstrap";
import useQuote from "../hook/useQuote";

function Statistics() {
  const who = useDecodingJwt();
  const { quote, author } = useQuote();

  return (
    <Container>
      <h4>{who}님의 루틴 현황입니다.</h4>
      <div>{quote}</div>
      <div>{" - " + author}</div>
      <div>
        <Link to={`/statistics/detail`}>자세히 보기</Link>
        <RoutineCalendar />
      </div>
    </Container>
  );
}

export default Statistics;
