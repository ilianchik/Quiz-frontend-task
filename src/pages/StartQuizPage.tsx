import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatchFunction, useSelectorFunction } from "../store/hooks";
import { updateScore } from "../store/quizSlice";

export default function StartQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatchFunction();
  const quiz = useSelectorFunction((state) =>
    state.quizzes.find((quiz) => quiz.id === id)
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz?.time || 0);
  const [questionsProgress, setQuestionsProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        handleSubmitQuiz();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (quiz) {
      setQuestionsProgress(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, quiz]);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerId });
  };

  const handleNextQuestion = () => {
    if (quiz) {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleSubmitQuiz();
      }
    }
  };

  const handleSubmitQuiz = () => {
    let newScore = 0;
    quiz?.questions.forEach((question) => {
      const correctAnswer = question.answers.find((answer) => answer.isCorrect);
      if (selectedAnswers[question.id] === correctAnswer?.id) {
        newScore += question.points;
      }
    });

    setIsQuizCompleted(true);
    dispatch(updateScore({ id: String(id), score: newScore }));
  };

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m:${seconds}s`;
  };

  return (
    <div className="relative pb-10">
      <h2 className="text-xl text-center font-bold mb-8">{quiz.name}</h2>

      {!isQuizCompleted ? (
        <>
          <div className="mb-3 text-lg">
            Progress: {questionsProgress}/{quiz.questions.length}
          </div>
          <div className="text-center text-lg">
            <h3 className="mb-4">
              {quiz.questions[currentQuestionIndex].question}
            </h3>
            <div className="text-start flex flex-col gap-5">
              {quiz.questions[currentQuestionIndex].answers.map((answer) => (
                <div key={answer.id} className="bg-slate-100 flex gap-2 ">
                  <input
                    className="ml-3"
                    type="radio"
                    id={`answer-${answer.id}`}
                    name={`question-${quiz.questions[currentQuestionIndex].id}`}
                    value={answer.id}
                    checked={
                      selectedAnswers[
                        quiz.questions[currentQuestionIndex].id
                      ] === answer.id
                    }
                    onChange={() =>
                      handleAnswerSelect(
                        quiz.questions[currentQuestionIndex].id,
                        answer.id
                      )
                    }
                  />
                  <label className="flex-1 p-3" htmlFor={`answer-${answer.id}`}>
                    {answer.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button
            className="absolute right-0 -bottom-5 border-2 border-[#008000] px-2 py-1 rounded-lg"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < quiz.questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </button>
          <div className="absolute left-0 -bottom-5">
            {" "}
            Time left: {formatTime(timeLeft)}
          </div>
        </>
      ) : (
        <div className="flex flex-col ">
          <div className="mx-auto flex flex-col gap-3 text-lg">
            <h3>Your Score: {quiz.latestScore}</h3>
            <h3>Your Best Score: {quiz.bastScore}</h3>
          </div>
          <button
            className="absolute top-0 left-0"
            onClick={() => navigate("/")}
          >
            &#8592; Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
