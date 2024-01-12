import "../src/css/App.css";
import { Routes, Route } from "react-router-dom";
import Enter from "./routes/Enter";
import Home from "./routes/Home";
import Managing from "./routes/Managing";
import Statistics from "./routes/Statistics";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Enter />} />
      <Route path={"/home/:memberName"} element={<Home />} />
      <Route path={"/routines/:memberName"} element={<Managing />} />
      <Route path={"/statistics/:memberName"} element={<Statistics />} />
    </Routes>
  );
}

export default App;
