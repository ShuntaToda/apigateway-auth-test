import { useEffect } from 'react';
import './App.css';

function App() {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&state=xyz&scope=openid&redirect_uri=http://127.0.0.1:3000`
  const handleLogin = async () => {
    window.location.href = authUrl
  }

  useEffect(() => {
    console.log(window.location)
    const params = new URLSearchParams(window.location.search); // ハッシュの最初の#を取り除く
    const code = params.get('code');

    console.log(code)
    getToken(code)
  }, []);


  const getToken = async (code) => {
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
      console.log(data);
    } catch (error) {
      console.error('API Request failed:', error);
    }
  };


  return (
    <div className="App">
      <button onClick={handleLogin}>login</button>
    </div>
  );
}

export default App;
