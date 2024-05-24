import { useParams } from "react-router-dom";
import QuizForm from "../components/QuizForm";

export default function UpdateQuizPage() {
  const { id } = useParams();
  return (
    <div className="relative pb-10">
      <QuizForm mode="update" quizId={id} />
    </div>
  );
}
