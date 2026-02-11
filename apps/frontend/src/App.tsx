import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FlashcardListPage from './pages/FlashcardListPage'
import FlashcardDetailPage from './pages/FlashcardDetailPage'
import ProfilePage from './pages/ProfilePage'
import GameModePage from './pages/GameModePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MatchingGame from './pages/games/MatchingGame'
import PuzzleGame from './pages/games/PuzzleGame'
import MemoryGame from './pages/games/MemoryGame'
import QuizGame from './pages/games/QuizGame'
import ConnectGame from './pages/games/ConnectGame'
import FillGame from './pages/games/FillGame'
import Layout from './components/Layout'

// 创建数据路由器
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: "/flashcards/:ageGroupId",
    element: <Layout><FlashcardListPage /></Layout>,
  },
  {
    path: "/flashcard/:id",
    element: <Layout><FlashcardDetailPage /></Layout>,
  },
  {
    path: "/profile",
    element: <Layout><ProfilePage /></Layout>,
  },
  {
    path: "/games",
    element: <Layout><GameModePage /></Layout>,
  },
  {
    path: "/games/matching",
    element: <Layout><MatchingGame /></Layout>,
  },
  {
    path: "/games/puzzle",
    element: <Layout><PuzzleGame /></Layout>,
  },
  {
    path: "/games/memory",
    element: <Layout><MemoryGame /></Layout>,
  },
  {
    path: "/games/quiz",
    element: <Layout><QuizGame /></Layout>,
  },
  {
    path: "/games/connect",
    element: <Layout><ConnectGame /></Layout>,
  },
  {
    path: "/games/fill",
    element: <Layout><FillGame /></Layout>,
  },
  {
    path: "/login",
    element: <Layout><LoginPage /></Layout>,
  },
  {
    path: "/register",
    element: <Layout><RegisterPage /></Layout>,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
