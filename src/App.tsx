import { Route, Routes } from 'react-router-dom';
import { Links } from './components/Links/Links';
import { AuthProvider } from './components/context/AuthContext';
import Header from './components/Header/Header';

function App() {

  return (
    <AuthProvider>
    <div className="app">
      <Header />
      <h1 className="title">Link Shortener</h1>
        <Routes>
          <Route path ='/' element = {<Links/>}/>
        </Routes>
      </div>
      </AuthProvider>
  );
}

export default App;