import "../src/css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Enter from "./routes/Enter";
import Home from "./routes/Home";
import Managing from "./routes/Managing";
import Statistics from "./routes/Statistics";
import Detail from "./routes/Detail";
import MyPage from "./routes/MyPage";
import Container from "react-bootstrap/esm/Container";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Container fluid="sm" style={{ height: "100%", overflowY: "auto" }}>
        <Header />
        <Container style={{ marginTop: "72px" }}>
          <Routes>
            <Route path={"/"} element={<Enter />} />
            <Route path={"/home"} element={<Home />} />
            <Route path={"/routines"} element={<Managing />} />
            <Route path={"/statistics"} element={<Statistics />} />
            <Route path={"/statistics/detail"} element={<Detail />} />
            <Route path={"/mypage"} element={<MyPage />} />
            {/* <Route
              path={"/home"}
              element={<PrivateRoute component={<Home />} />}
            />
            <Route
              path={"/routines"}
              element={<PrivateRoute component={<Managing />} />}
            />
            <Route
              path={"/statistics"}
              element={<PrivateRoute component={<Statistics />} />}
            />
            <Route
              path={"/statistics/detail"}
              element={<PrivateRoute component={<Detail />} />}
            />
            <Route
              path={"/mypage"}
              element={<PrivateRoute component={<MyPage />} />}
            /> */}
          </Routes>
        </Container>
      </Container>
    </div>
  );
}

export default App;
