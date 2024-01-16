import "../src/css/App.css";
import { Routes, Route } from "react-router-dom";
import Enter from "./routes/Enter";
import Home from "./routes/Home";
import Managing from "./routes/Managing";
import Statistics from "./routes/Statistics";
import Detail from "./routes/Detail";
import MyPage from "./routes/MyPage";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Enter />} />
      <Route path={"/home/:memberName"} element={<Home />} />
      <Route path={"/routines/:memberName"} element={<Managing />} />
      <Route path={"/statistics/:memberName"} element={<Statistics />} />
      <Route path={"/statistics/detail/:memberName"} element={<Detail />} />
      <Route path={"/mypage/:memberName"} element={<MyPage />} />
    </Routes>
  );
}

export default App;
