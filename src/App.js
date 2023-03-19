import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Cookies from "js-cookie";
import Signin from "./components/Signin";
import NotSignin from "./components/NotSignin";

function App() {
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      setIsToken(true);
    }
  }, []);

  return (
    <div className="App">
      {!isToken ? <NotSignin></NotSignin> : <Signin></Signin>}
    </div>
  );
}

export default App;
