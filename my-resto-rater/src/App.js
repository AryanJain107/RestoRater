import './App.css';
import Login from './pages/login';
import LandingPage from './pages/LandingPage';
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
} from "react-router-dom";
import * as ROUTES from "./routes";
import SignUp from './pages/signup';
import HomePage from './pages/HomePage';
import { AuthProvider,useAuth } from "./pages/AuthContext";
import Header from './pages/Header';


function App() {
  const { user, isAuthenticated, logout } = useAuth(); 

  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
