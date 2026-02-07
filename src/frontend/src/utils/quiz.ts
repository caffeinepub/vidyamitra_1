import type { QuizQuestion } from '../backend';

const questionPool: QuizQuestion[] = [
  {
    questionText: 'What is React?',
    answerOptions: ['A JavaScript library', 'A programming language', 'A database', 'An operating system'],
    correctAnswerIndex: BigInt(0),
    category: 'React',
  },
  {
    questionText: 'What does JSX stand for?',
    answerOptions: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
    correctAnswerIndex: BigInt(0),
    category: 'React',
  },
  {
    questionText: 'Which hook is used for side effects?',
    answerOptions: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswerIndex: BigInt(1),
    category: 'React',
  },
  {
    questionText: 'What is TypeScript?',
    answerOptions: ['A superset of JavaScript', 'A database', 'A framework', 'A CSS preprocessor'],
    correctAnswerIndex: BigInt(0),
    category: 'TypeScript',
  },
  {
    questionText: 'What is the purpose of useState?',
    answerOptions: ['To manage component state', 'To fetch data', 'To style components', 'To route pages'],
    correctAnswerIndex: BigInt(0),
    category: 'React',
  },
  {
    questionText: 'What is a Promise in JavaScript?',
    answerOptions: ['An object representing async operation', 'A loop', 'A variable type', 'A function'],
    correctAnswerIndex: BigInt(0),
    category: 'JavaScript',
  },
  {
    questionText: 'What does CSS stand for?',
    answerOptions: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
    correctAnswerIndex: BigInt(0),
    category: 'CSS',
  },
  {
    questionText: 'What is the purpose of useEffect?',
    answerOptions: ['To perform side effects', 'To create state', 'To render components', 'To define routes'],
    correctAnswerIndex: BigInt(0),
    category: 'React',
  },
  {
    questionText: 'What is REST API?',
    answerOptions: ['Representational State Transfer', 'Remote State Transfer', 'Real State Transfer', 'Rapid State Transfer'],
    correctAnswerIndex: BigInt(0),
    category: 'Web Development',
  },
  {
    questionText: 'What is Git?',
    answerOptions: ['Version control system', 'Programming language', 'Database', 'Web server'],
    correctAnswerIndex: BigInt(0),
    category: 'Tools',
  },
  {
    questionText: 'What is Node.js?',
    answerOptions: ['JavaScript runtime', 'Framework', 'Database', 'CSS library'],
    correctAnswerIndex: BigInt(0),
    category: 'JavaScript',
  },
  {
    questionText: 'What is the virtual DOM?',
    answerOptions: ['Lightweight copy of real DOM', 'A database', 'A server', 'A CSS framework'],
    correctAnswerIndex: BigInt(0),
    category: 'React',
  },
  {
    questionText: 'What is async/await?',
    answerOptions: ['Syntax for handling promises', 'A loop type', 'A variable declaration', 'A CSS property'],
    correctAnswerIndex: BigInt(0),
    category: 'JavaScript',
  },
  {
    questionText: 'What is Tailwind CSS?',
    answerOptions: ['Utility-first CSS framework', 'JavaScript library', 'Database', 'Testing tool'],
    correctAnswerIndex: BigInt(0),
    category: 'CSS',
  },
  {
    questionText: 'What is component composition?',
    answerOptions: ['Building complex UIs from simple components', 'Styling components', 'Testing components', 'Deploying components'],
    correctAnswerIndex: BigInt(0),
    category: 'React',
  },
  {
    questionText: 'What is the purpose of props?',
    answerOptions: ['Pass data to components', 'Style components', 'Create routes', 'Manage state'],
    correctAnswerIndex: BigInt(0),
    category: 'React',
  },
  {
    questionText: 'What is HTTP?',
    answerOptions: ['HyperText Transfer Protocol', 'High Transfer Protocol', 'Hyper Transfer Process', 'High Text Protocol'],
    correctAnswerIndex: BigInt(0),
    category: 'Web Development',
  },
  {
    questionText: 'What is JSON?',
    answerOptions: ['JavaScript Object Notation', 'Java Standard Object Notation', 'JavaScript Online Notation', 'Java Object Network'],
    correctAnswerIndex: BigInt(0),
    category: 'JavaScript',
  },
  {
    questionText: 'What is responsive design?',
    answerOptions: ['Design that adapts to screen sizes', 'Fast loading design', 'Colorful design', 'Animated design'],
    correctAnswerIndex: BigInt(0),
    category: 'CSS',
  },
  {
    questionText: 'What is a closure in JavaScript?',
    answerOptions: ['Function with access to outer scope', 'A loop', 'A variable', 'A class'],
    correctAnswerIndex: BigInt(0),
    category: 'JavaScript',
  },
];

export function generateQuizQuestions(count: number): QuizQuestion[] {
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questionPool.length));
}
