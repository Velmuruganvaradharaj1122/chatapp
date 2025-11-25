import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import Home from './pages/Home';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="h-screen bg-gray-100">
      {user ? <Home /> : <Login />}
    </div>
  );
}

export default App; 