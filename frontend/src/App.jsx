import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import RoughRectangle from './RoughRectangle.jsx';
import { v4 as uuidv4 } from 'uuid';
import './index.css';
import createUserToken from './CreateToken.js';
import fetchSessionStatus from './fetchSessionStatus.js';
import { Stack } from '@mui/material';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [sessionOn, setSessionOn] = useState(false);
  const [socket, setSocket] = useState(null)
  const [allshapes, setAllshapes] = useState([])
  const [undoStack, setUndoStack] = useState([]);
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
        // console.log("main data", data)
        setAllshapes(data.shapes)
        if (!data.shapes || data.shapes.length === 0) {
          setUndoStack(...undoStack, [])
        }
        else
          setUndoStack([...undoStack, data.shapes])
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
        console.log('Received message is not session-------------------', msg);
        await createUserToken({ setUser });
        window.location.reload(true)
      } else {
        setUser(msg.user);
      }
    };

    return () => {
      socket.close();
    };
  }, [user]);

  useEffect(() => {
    async function fetchUserSession() {
      try {
        const response = await fetch(`http://localhost:3010/api/user/${user}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          const session = data.session;
          setSessionOn(session);
        } else {
          console.error("Failed to fetch user session:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    }

    fetchUserSession(); // Call the async function
  }, [location, sessionOn, user]); // Dependency array ensures this runs when 'user' changes

  useEffect(() => {
    console.log("ppsdosownefew")
    // const params = new URLSearchParams(location.hash.slice(1));
    // const roomId = params.get('room');
    const userId = location.pathname.includes('user=')
      ? location.pathname.split('user=')[1].split('/')[0]
      : null;

    console.log("this is userid", userId)

    async function fn() {
      const sessionToken = location.pathname.includes('session=')
        ? location.pathname.split('session=')[1]
        : null;
      console.log("this is session", sessionToken)
      const sessionStatus = await fetchSessionStatus(userId)
      if (userId && sessionStatus.session && sessionStatus.shareToken === sessionToken) {
        console.log("wfdwsfsdfsf", userId)
        setSessionOn(true)
        setUser(userId);
      }
      else {
        await createUserToken({ setUser })
      }

    }
    fn()
  }, [location, sessionOn, user]);
  // Constants
  const TIME_LIMIT = 1 * 60 * 60 * 1000; // 2 hours in milliseconds
  const LAST_ACTIVITY_KEY = "lastActivity";

  const updateLastActivity = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem(LAST_ACTIVITY_KEY, currentTime.toString());
  };

  // Function to check activity timestamp on component load
  const checkActivity = () => {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    const currentTime = new Date().getTime();

    if (lastActivity) {
      const timeDifference = currentTime - parseInt(lastActivity, 10);

      if (timeDifference > TIME_LIMIT) {
        // Reload the page if time difference exceeds the limit
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkActivity();

    // Set up activity listeners
    const activityHandler = () => updateLastActivity();
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("click", activityHandler);
    window.addEventListener("keypress", activityHandler);
    window.addEventListener("touchstart", activityHandler);

    // Set an interval to check activity every 30 minutes
    const interval = setInterval(() => {
      checkActivity();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    // Set the initial timestamp
    updateLastActivity();

    // Cleanup function to remove listeners and interval
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("click", activityHandler);
      window.removeEventListener("keypress", activityHandler);
      window.removeEventListener("touchstart", activityHandler);
    };
  }, []);
  return (
    <div>
      <RoughRectangle user={user} setUser={setUser}
        sessionActive={sessionOn} setSessionActive={setSessionOn} socket={socket} setSocket={setSocket}
        setAllshapes={setAllshapes} allshapes={allshapes} undoStack={undoStack} setUndoStack={setUndoStack} />
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
