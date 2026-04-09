import {
  ChatPanel,
  SummaryPanel,
  FlashcardsPanel,
  QuizPanel,
  ProgressPanel,
} from "./FeaturePanels";

export const FEATURES = [
  {
    label: "AI Chat",
    tag: "Chat",
    heading: "Your AI tutor that actually knows your coursework",
    description:
      "Trained on your uploaded notes, Monkey Mentor answers questions, explains concepts, and generates study tools around the clock via chat.",
    Panel: ChatPanel,
  },
  {
    label: "Summaries",
    tag: "Summaries",
    heading: "Your materials, organized and ready to study",
    description:
      "Upload any PDF and get a clean, AI-generated summary in under 10 seconds. Choose summarized, in-depth, or comprehensive formats.",
    Panel: SummaryPanel,
  },
  {
    label: "Flashcards",
    tag: "Flashcards",
    heading: "Smart flashcards generated from your notes",
    description:
      "Auto-generate a full flashcard deck from any upload. Study with spaced repetition built in to maximize what you remember.",
    Panel: FlashcardsPanel,
  },
  {
    label: "Practice Quizzes",
    tag: "Practice Quizzes",
    heading: "Test yourself with AI-generated quizzes",
    description:
      "Generate multiple choice and short answer questions tailored precisely to your lecture material. Know what you know before exam day.",
    Panel: QuizPanel,
  },
  {
    label: "Progress Tracking",
    tag: "Progress Tracking",
    heading: "See exactly where you stand",
    description:
      "Track your understanding over time. See which topics need more review and which ones you have mastered — all from your dashboard.",
    Panel: ProgressPanel,
  },
];
