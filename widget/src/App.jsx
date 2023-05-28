
import './App.css';
import { MainPage } from './pages/MainPage/MainPage';
import axios from "axios";

axios.defaults.withCredentials = true;
function App() {
  return (
    <div className='body'>
      <MainPage/>
    </div>
  );
}

export default App;
