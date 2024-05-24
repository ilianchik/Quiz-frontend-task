export type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  question: string;
  answers: Answer[];
  points: number;
};

export type Quiz = {
  id: string;
  name: string;
  questions: Question[];
  latestScore: number;
  bastScore: number;
  time: number;
};
