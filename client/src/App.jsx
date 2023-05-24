import Routes from "./Routes";
import axios from 'axios';

function App() {
  axios.defaults.baseURL = 'http://localhost:4000'
  axios.defaults.withCredentials = true;

  return (
    <Routes />
  )
}

export default App
