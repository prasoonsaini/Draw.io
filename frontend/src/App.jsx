import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import RoughRectangle from './RoughRectangle.jsx';
import { v4 as uuidv4 } from 'uuid';
import './index.css';
import createUserToken from './CreateToken.js';
import fetchSessionStatus from './fetchSessionStatus.js';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [sessionOn, setSessionOn] = useState(false);

  useEffect(() => {
    console.log("ppsdosownefew")
    // const params = new URLSearchParams(location.hash.slice(1));
    // const roomId = params.get('room');
    const userId = location.pathname.includes('user=')
      ? location.pathname.split('user=')[1]
      : null;

    // const fetchSessionStatus = async () => {
    //   if (userId) {
    //     try {
    //       const response = await fetch(`http://localhost:3010/api/user/${userId}`, {
    //         method: 'GET'
    //       });
    //       if (response.ok) {
    //         const data = await response.json();
    //         setSessionOn(data.session || false);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching session status:", error);
    //     }
    //   }
    // };



    // if (userId && fetchSessionStatus(userId)) {
    //   console.log('Collaboration mode: Shared session with user:', userId);
    //   setSessionOn(true)
    //   setUser(userId);
    // } else {
    //   setSessionOn(false)
    // const createUserToken = async () => {
    //   let token = localStorage.getItem("drawingToken");
    //   if (!token) {
    //     token = uuidv4();
    //     localStorage.setItem("drawingToken", token);
    //     console.log("New token generated:", token);
    //     await fetch("http://localhost:3010/api/user", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ token, session: false }),
    //     });
    //   } else {
    //     console.log("Existing token found:", token);
    //   }
    //   setUser(token);
    // };
    // createUserToken({ setUser });
    // }
    async function fn() {
      const sessionStatus = await fetchSessionStatus(userId)
      if (userId && sessionStatus) {
        console.log("wfdwsfsdfsf", userId)
        // setSessionOn(true)
        setUser(userId);
      }
      else await createUserToken({ setUser })
    }
    fn()
  }, [location, sessionOn]);

  return (
    <div>
      <RoughRectangle user={user} setUser={setUser} sessionActive={sessionOn} setSessionActive={setSessionOn} />
    </div>
  );
}

// Root Component with Router
export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
