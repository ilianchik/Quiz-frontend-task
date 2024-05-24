import { useState } from "react";
import { useDispatchFunction } from "../store/hooks";
import { removeQuiz } from "../store/quizSlice";
import { Quiz } from "../types/types";
import { useNavigate } from "react-router-dom";
type QuizItemProps = {
  quiz: Quiz;
};
export default function QuizItem({ quiz }: QuizItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatchFunction();
  const navigate = useNavigate();

  function handleDeleteQuiz() {
    dispatch(removeQuiz(quiz.id));
  }
  console.log(quiz);

  return (
    <li>
      <div className="border-2 border-black p-2 rounded-lg flex justify-between items-center">
        <p>{quiz.name}</p>
        <div className="flex gap-5 ">
          <button
            onClick={() => navigate(`/quiz/start/${quiz.id}`)}
            className="border-2 border-[#008000] px-2 py-1  rounded-lg "
          >
            Start quiz
          </button>
          <button
            onClick={() => navigate(`/quiz/update/${quiz.id}`)}
            className="border-2 border-[#FFC300] px-2 py-1 rounded-lg "
          >
            Edit quiz
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="border-2 border-[#DC143C] px-2 py-1 rounded-lg "
          >
            Delete quiz
          </button>
        </div>
      </div>
      {showDeleteModal && (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-30">
          <div className="w-[30%] h-[30%] absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] bg-white flex flex-col items-center justify-center p-3 gap-10">
            <p>Are you sure you want to delete {quiz.name}</p>
            <div className="flex gap-10">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-[#DC143C] p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuiz}
                className="bg-[#7CFC00] p-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
