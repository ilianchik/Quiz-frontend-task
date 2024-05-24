import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateQuizPage from "./pages/CreateQuizPage";
import UpdateQuizPage from "./pages/UpdateQuizPage";
import StartQuizPage from "./pages/StartQuizPage";

function App() {
  return (
    <>
      <div className="max-w-5xl mx-auto p-10 bg-slate-200 rounded-xl m-5 ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/new" element={<CreateQuizPage />} />
          <Route path="/quiz/update/:id" element={<UpdateQuizPage />} />
          <Route path="/quiz/start/:id" element={<StartQuizPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
