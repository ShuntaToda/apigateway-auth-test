import { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  const [authInfo, setAuthInfo] = useState({})
  const handleLogin = async () => {
    const params = {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: "http://127.0.0.1:3000",
      scope: "openid",
      response_type: "code",
      state: "xyz"
    }
    const query = new URLSearchParams(params).toString()
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${query}`
  }

  useEffect(() => {
    console.log(window.location)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const getAuthInfo = async () => {
      const responseAuthInfo = await requestAuthInfo(code)
      console.log(responseAuthInfo)
      setAuthInfo(responseAuthInfo)
    }
    getAuthInfo()
  }, []);

  useEffect(() => {
    const getMessage = async () => {
      const response = await requestMessage(authInfo)
      console.log(response)
    }
    // console.log(Object.keys(authInfo).length === 0 ? 1 : 0)

    if (Object.keys(authInfo).length === 0 ? 1 : 0) getMessage()
  }, [authInfo])


  const requestAuthInfo = async (code) => {
    try {
      const params = {
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        client_secret: process.env.REACT_APP_GOOGLE_SECRET,
        redirect_uri: "http://127.0.0.1:3000",
        grant_type: "authorization_code",
        code: code
      }
      const response = await fetch("https://www.googleapis.com/oauth2/v4/token/", {
        method: 'POST',
        body: JSON.stringify(params)
      });
      const data = await response.json();

      return data
    } catch (error) {
      console.error('API Request failed:', error);
    }
  };

  const requestMessage = async (authInfo) => {
    try {
      const response = await fetch("https://p2uj50alqh.execute-api.ap-northeast-1.amazonaws.com/poc-lambda-jwt01", {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${authInfo.id_token}`,
        }
      });
      const data = await response.json();
      console.log(data);

      return data
    } catch (error) {
      console.error('API Request failed:', error);
    }
  }

  return (
    <div className="App container">
      <div className='mt-4 text-center'>
        <button className='btn btn-primary' onClick={handleLogin}>login</button>
      </div>
    </div>
  );
}

export default App;
