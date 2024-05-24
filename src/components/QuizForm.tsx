import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Question } from "../types/types";
import { useDispatchFunction, useSelectorFunction } from "../store/hooks";
import { addQuiz, resetScore, updateQuiz } from "../store/quizSlice";
import { useNavigate } from "react-router-dom";

export default function QuizForm({
  mode,
  quizId,
}: {
  mode: "create" | "update";
  quizId?: string;
}) {
  const quiz = useSelectorFunction((state) =>
    state.quizzes.find((quiz) => quiz.id === quizId)
  );
  const [quizName, setQuizName] = useState(
    mode === "create" ? "" : quiz?.name || ""
  );
  const [quizTime, setQuizTime] = useState(mode === "create" ? "" : quiz?.time);
  const [questions, setQuestions] = useState<Question[]>(
    mode === "create"
      ? [{ id: uuidv4(), question: "", answers: [], points: 0 }]
      : quiz?.questions || []
  );
  const dispatch = useDispatchFunction();
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: uuidv4(), question: "", answers: [], points: 0 },
    ]);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleAddAnswer = (questionId: string) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          answers: [
            ...question.answers,
            { id: uuidv4(), text: "", isCorrect: false },
          ],
        };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleDeleteAnswer = (questionId: string, answerId: string) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          answers: question.answers.filter((a) => a.id !== answerId),
        };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string,
    answerId?: string
  ) {
    const { name, value, checked } = e.target;

    if (name.startsWith("question")) {
      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, question: value } : q
      );
      setQuestions(updatedQuestions);
    } else if (name.startsWith("points")) {
      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, points: Number(value) } : q
      );
      setQuestions(updatedQuestions);
    } else if (name.startsWith("answer")) {
      const updatedQuestions = questions.map((q) => {
        if (q.id === questionId) {
          const updatedAnswers = q.answers.map((a) =>
            a.id === answerId ? { ...a, text: value } : a
          );
          return { ...q, answers: updatedAnswers };
        }
        return q;
      });
      setQuestions(updatedQuestions);
    } else if (name.startsWith("correct")) {
      const updatedQuestions = questions.map((q) => {
        if (q.id === questionId) {
          const updatedAnswers = q.answers.map((a) =>
            a.id === answerId ? { ...a, isCorrect: checked } : a
          );
          return { ...q, answers: updatedAnswers };
        }
        return q;
      });
      setQuestions(updatedQuestions);
    }
    console.log(questions);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      dispatch(
        addQuiz({
          id: String(uuidv4()),
          name: quizName,
          bastScore: 0,
          latestScore: 0,
          questions: questions,
          time: Number(quizTime),
        })
      );
    }
    if (mode == "update") {
      dispatch(
        updateQuiz({
          id: quizId || "",
          name: quizName,
          bastScore: quiz?.bastScore || 0,
          latestScore: quiz?.latestScore || 0,
          time: Number(quizTime),
          questions: questions,
        })
      );
      dispatch(resetScore(String(quizId)));
    }
    navigate("/");
  };

  return (
    <div>
      <h2 className="text-xl text-center font-bold mb-8">
        {mode === "create" ? "Create a New Quiz" : "Update Quiz"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-5 mb-5">
          <label htmlFor="quizName">Quiz Name:</label>
          <input
            className="px-2 py-1 rounded-lg items-center"
            type="text"
            id="quizName"
            name="quizName"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
          <label htmlFor="quizTime">Quiz Time(in seconds):</label>
          <input
            className="px-2 py-1 rounded-lg items-center"
            type="number"
            id="quizTime"
            name="quizTime"
            value={quizTime}
            onChange={(e) => setQuizTime(e.target.value)}
            required
          />
        </div>
        <button
          onClick={() => navigate("/")}
          className=" px-2 py-1 rounded-lg absolute top-0"
          type="button"
        >
          &#8592; Home
        </button>
        {questions.map((question) => (
          <div
            className="border-b-2 border-black pb-5 pt-5 relative"
            key={question.id}
          >
            <div className="flex gap-5">
              <label htmlFor={`question-${question.id}`}>Question:</label>
              <input
                className="px-5 py-1 rounded-lg items-center w-[50%]"
                type="text"
                id={`question-${question.id}`}
                name={`question-${question.id}`}
                value={question.question}
                onChange={(e) => handleInputChange(e, question.id)}
                required
              />
              <label htmlFor={`points-${question.id}`}>Points:</label>
              <input
                className="px-5 py-1 rounded-lg items-center w-[10%]"
                type="number"
                id={`points-${question.id}`}
                name={`points-${question.id}`}
                value={question.points}
                onChange={(e) => handleInputChange(e, question.id)}
                required
              />
              <button
                className="border-2 border-[#FF0000] px-2 py-1 rounded-lg absolute bottom-2"
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                Delete Question
              </button>
            </div>

            {question.answers.map((answer) => (
              <div className="flex gap-5 mt-3" key={answer.id}>
                <label htmlFor={`answer-${answer.id}`}>Answer:</label>
                <input
                  className="px-5 py-1 rounded-lg items-center w-[40%]"
                  type="text"
                  id={`answer-${answer.id}`}
                  name={`answer-${answer.id}`}
                  value={answer.text}
                  onChange={(e) => handleInputChange(e, question.id, answer.id)}
                  required
                />
                <input
                  type="checkbox"
                  id={`correct-${answer.id}`}
                  name={`correct-${answer.id}`}
                  checked={answer.isCorrect}
                  onChange={(e) => handleInputChange(e, question.id, answer.id)}
                />
                <label htmlFor={`correct-${answer.id}`}>Correct</label>
                <button
                  className="border-2 border-[#FF0000] px-2 py-1 rounded-lg"
                  type="button"
                  onClick={() => handleDeleteAnswer(question.id, answer.id)}
                >
                  Delete Answer
                </button>
              </div>
            ))}

            <button
              className="border-2 border-[#008000] px-2 py-1 rounded-lg block ml-auto mt-3"
              type="button"
              onClick={() => handleAddAnswer(question.id)}
            >
              Add Answer
            </button>
          </div>
        ))}
        <div className="absolute -bottom-5 right-3 flex gap-5">
          <button
            className="border-2 border-[#008000] px-2 py-1 rounded-lg"
            type="button"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
          <button
            className="border-2 border-[#FFC300] px-2 py-1 rounded-lg"
            type="submit"
          >
            {mode === "create" ? "Create Quiz" : "Update Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
