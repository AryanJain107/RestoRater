// import logo from './logo.svg';
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


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path={ROUTES.SIGN_UP} element={<Signin />} /> */}
        {/* <Route path={ROUTES.LOGIN} element={<Login />} /> */}
        {/* <Route element={<PrivateRoute/>}>
          <Route path={ROUTES.WEB_APP} element={<WebApp/>}/>
        </Route> */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
