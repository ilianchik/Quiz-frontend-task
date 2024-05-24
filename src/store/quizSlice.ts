import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz } from "../types/types";

interface QuizState {
  quizzes: Quiz[];
}

const initialState: QuizState = {
  quizzes: [
    {
      id: "1",
      name: "Test quiz",
      latestScore: 0,
      bastScore: 0,
      time: 60,
      questions: [
        {
          id: "1",
          points: 10,
          question: "What is React?",
          answers: [
            { id: "1", text: "some text", isCorrect: false },
            { id: "2", text: "some text", isCorrect: true },
            { id: "3", text: "some text", isCorrect: false },
          ],
        },
        {
          id: "2",
          points: 10,
          question: "What is Nextjs?",
          answers: [
            { id: "1", text: "some text", isCorrect: true },
            { id: "2", text: "some text", isCorrect: false },
            { id: "3", text: "some text", isCorrect: false },
          ],
        },
        {
          id: "3",
          points: 10,
          question: "What is Nodejs?",
          answers: [
            { id: "1", text: "some text", isCorrect: false },
            { id: "2", text: "some text", isCorrect: false },
            { id: "3", text: "some text", isCorrect: true },
          ],
        },
      ],
    },
  ],
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    addQuiz(state, action: PayloadAction<Quiz>) {
      state.quizzes.push(action.payload);
    },
    removeQuiz(state, action: PayloadAction<string>) {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz.id !== action.payload
      );
    },
    updateQuiz(state, action: PayloadAction<Quiz>) {
      const index = state.quizzes.findIndex(
        (quiz) => quiz.id === action.payload.id
      );
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    },
    updateScore(state, action: PayloadAction<{ id: string; score: number }>) {
      const index = state.quizzes.findIndex(
        (quiz) => quiz.id === action.payload.id
      );
      if (index !== -1) {
        state.quizzes[index].latestScore = action.payload.score;
        if (state.quizzes[index].bastScore < action.payload.score) {
          state.quizzes[index].bastScore = action.payload.score;
        }
      }
    },
    resetScore(state, action: PayloadAction<string>) {
      const index = state.quizzes.findIndex(
        (quiz) => quiz.id === action.payload
      );
      if (index !== -1) {
        state.quizzes[index].bastScore = 0;
        state.quizzes[index].latestScore = 0;
      }
    },
  },
});

export const { addQuiz, removeQuiz, updateQuiz, updateScore, resetScore } =
  quizSlice.actions;
