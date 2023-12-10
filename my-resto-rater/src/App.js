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
  const { user, isAuthenticated, logout } = useAuth(); // Destructure the values from useAuth

  return (
    <Router>
      {/* <Header user={user} isAuthenticated={isAuthenticated} logout={logout} /> */}
      <Routes>
        {/* <Route path={ROUTES.SIGN_UP} element={<Signin />} /> */}
        {/* <Route path={ROUTES.LOGIN} element={<Login />} /> */}
        {/* <Route element={<PrivateRoute/>}>
          <Route path={ROUTES.WEB_APP} element={<WebApp/>}/>
        </Route> */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
