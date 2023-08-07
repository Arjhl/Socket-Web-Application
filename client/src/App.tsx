import "./App.css";
import SignUp from "./components/Signup";

function App() {
  console.log(import.meta.env.VITE_SERVER_URL);
  return <SignUp />;
}

export default App;
