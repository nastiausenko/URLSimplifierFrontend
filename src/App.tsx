import { Route, Routes } from 'react-router-dom';
import { Links } from './components/Links/Links';
import { AuthProvider } from './components/context/AuthContext';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

function App() {

  return (
    <AuthProvider>
    <div className="app">
      <Header />
      <h1 className="title">Link Shortener</h1>
        <Routes>
          <Route path ='/' element = {<Links/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </div>
      </AuthProvider>
  );
}

export default App;