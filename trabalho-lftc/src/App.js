import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './Components/Home';
import {Row, Col} from 'reactstrap'
import Regex from './Components/Regex';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <div>
      <Router>
        <Row className='p-2'>
          <Col lg="4"><Link to="/">HOME</Link></Col>
          <Col lg="4"><Link to="/regex">REGEX</Link></Col>
        </Row>
        
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/regex" element={<Regex/>}/>
           
        </Routes>
      </Router>
    </div>
  );
}

export default App;
