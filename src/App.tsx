import { Route, Routes } from 'react-router-dom';
import { Links } from './components/Links/Links';

function App() {

  return (
      <div className="app">
        <h1 className="title">Link Shortener</h1>
        <Routes>
          <Route path ='/' element = {<Links/>}/>
        </Routes>
      </div>
  );
}

export default App;