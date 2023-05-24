import { useContext, useState } from "react";
import axios from 'axios';
import { UserContext } from "../state/userContext";

const RegisterAndLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogInOrRegister, setIsLogInOrRegister] = useState('register')
  const {setUsername: setLoggedInUsername, setId} = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = isLogInOrRegister === 'register' ? 'register' : 'login';
    const {data} = await axios.post('/register', {username,password});
    setLoggedInUsername(username);
    setId(data.id);
  }

  return ( 
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input value={username} 
               onChange={event => setUsername(event.target.value)} 
               type="text" 
               placeholder="username" 
               className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input value={password} 
               onChange={event => setPassword(event.target.value)} 
               type="password" 
               placeholder="password" 
               className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLogInOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className="text-center mt-2">
          {isLogInOrRegister === 'register' && (
            <div>
              Already a member?{' '}
              <button onClick={() => {setIsLogInOrRegister('login')}}>
                Login Here
              </button>
            </div>
          )}
          {isLogInOrRegister === 'login' && (
            <div>
              Don't have an account?{' '}
              <button onClick={() => {setIsLogInOrRegister('register')}}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default RegisterAndLogin;