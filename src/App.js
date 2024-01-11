import "../src/css/App.css";
import { Routes, Route } from "react-router-dom";
import Enter from "./routes/Enter";
import Home from "./routes/Home";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Enter />} />
      <Route path={"/home"} element={<Home />} />
    </Routes>
  );
}

export default App;
