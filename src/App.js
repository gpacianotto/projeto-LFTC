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
import Grammar from './Components/Grammar';
import AutoFin from './Components/AutoFin';

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
    //
    // </div>
    <div>
      <Router>
        <Row className='p-2'>
          <Col lg="3"><Link to="/">HOME</Link></Col>
          <Col lg="3"><Link to="/regex">REGEX</Link></Col>
          <Col lg="3"><Link to="/grammar">GRAMÁTICA</Link></Col>
          <Col lg="3"><Link to="/automatos">AUTOMATOS</Link></Col>
        </Row>
        
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/regex" element={<Regex/>}/>
          <Route path="/grammar" element={<Grammar/>}></Route>
          <Route path="/automatos" element={<AutoFin/>}/>
           
        </Routes>
        <Row className='text-center'>
          <Col>
            <h4>feito por: Guilherme de Aguiar Pacianotto, João Pedro Silva Baptista, Andrey Cunha Barreira de Araujo</h4>
          </Col>
        </Row>
      </Router>
    </div>
  );
}

export default App;
