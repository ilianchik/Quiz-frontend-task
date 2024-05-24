import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizItem from "../components/QuizItem";
import { useSelectorFunction } from "../store/hooks";

export default function HomePage() {
  const navigate = useNavigate();
  const quizzes = useSelectorFunction((state) => state.quizzes);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl text-center font-bold">Your quizzes</h1>
      <div className="flex justify-end mb-8">
        <button
          onClick={() => navigate("/quiz/new")}
          className="border-2 border-black px-2 py-1 rounded-lg"
        >
          Add new quiz
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by quiz name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-1 mb-3"
      />
      <ul className="flex flex-col gap-5">
        {filteredQuizzes.map((quiz) => (
          <QuizItem quiz={quiz} key={quiz.id} />
        ))}
      </ul>

      {quizzes.length < 1 && (
        <h1 className="text-xl text-center">Create your first quiz!</h1>
      )}
    </div>
  );
}
