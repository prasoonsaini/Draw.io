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
  const [sessionOn, setSessionOn] = useState(true);
  const [socket, setSocket] = useState(null)
  const [allshapes, setAllshapes] = useState([])
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    const fetchShapes = async () => {
      try {
        const response = await fetch(`http://localhost:3020/shapes/${user}`); // Fetch shapes from the API

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json()
        console.log("response from redis", data.shapes)
        //console.log("main data", data)
        setAllshapes(data.shapes)
      }
      catch (error) {
        //console.error('Error fetching shapes:', error);
      }
    };

    socket.onopen = async () => {
      console.log('Connected');
      setSocket(socket);

      if (user) {
        const message = { user: user, session: true };
        socket.send(JSON.stringify(message));  // Send as JSON string

        const res = await fetch(`http://localhost:3020/user/${message.user}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const user_exist = await res.json();
        console.log("user exist", user_exist);

        if (!user_exist.exist) {
          console.log("No user exists in Redis, fetching data from MongoDB");

          const response = await fetch(`http://localhost:3010/api/shapes/${message.user}`);
          if (!response.ok) {
            console.log('Unable to fetch shapes from MongoDB');
            return;
          }

          const shapes = await response.json();
          console.log("Fetched shapes:", shapes);

          // Push all shapes to Redis and set them in the state
          await Promise.all(
            shapes.map(async (shape) => {
              const postRes = await fetch('http://localhost:3020/shapes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shape),
              });
              if (!postRes.ok) {
                console.log('Unable to post shape to Redis', shape);
                throw new Error('Error posting shape to Redis');
              }
              return shape;
            })
          );

          console.log("All shapes pushed to Redis, updating state");
          setAllshapes(shapes);
        }
        else {
          user ? fetchShapes() : null;
        }
      }
    };

    socket.onmessage = async (message) => {
      const msg = JSON.parse(message.data);
      console.log('Received message', msg);

      if (!msg.session) {
        console.log('Received message is not session', msg);
        await createUserToken({ setUser });
      } else {
        setUser(msg.user);
      }
    };

    return () => {
      socket.close();
    };
  }, [user]);



  useEffect(() => {
    console.log("ppsdosownefew")
    // const params = new URLSearchParams(location.hash.slice(1));
    // const roomId = params.get('room');
    const userId = location.pathname.includes('user=')
      ? location.pathname.split('user=')[1]
      : null;
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
      <RoughRectangle user={user} setUser={setUser}
        sessionActive={sessionOn} setSessionActive={setSessionOn} socket={socket} setSocket={setSocket} setAllshapes={setAllshapes} allshapes={allshapes} />
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
