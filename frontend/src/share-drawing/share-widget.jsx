import { useLocation } from 'react-router-dom'
import './share.css'
import { useEffect, useRef, useState } from 'react'
import createUserToken from '../CreateToken'
import Copy from '../components/ShapeCustomizer/SVG/copy'
import {
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
function ShareWidget({ user, sessionActive, setSessionActive, setUser, socket, setSocket, setShareWidgetRef }) {
    const ShareWidgetRef = useRef()
    console.log("ShareWidgetRef", ShareWidgetRef)
    const [sessionToken, setSessionToken] = useState(null)
    useEffect(() => {
        setShareWidgetRef(ShareWidgetRef); // Pass the ref to the parent
    }, [setShareWidgetRef]);
    useEffect(() => {
        if (!user)
            return
        async function getSession() {
            try {
                console.log("user in share widget", user)
                const response = await fetch(`https://draw-io-z8ub-backend.vercel.app/api/user/${user}`, {
                    method: 'GET'
                })
                const data = await response.json()
                console.log("data data", data.message)
                setSessionToken(data.shareToken)
                return data.session ? true : false
            } catch (error) {
                console.log("Error fetching session data:", error)
                return false
            }
        }

        async function fetchAndSetSession() {
            const session = await getSession()
            setSessionActive(session)
        }

        fetchAndSetSession()
    }, [user, sessionActive])

    console.log("user", user)
    console.log("session active", sessionActive)

    async function ActivateSession() {
        setSessionActive(Math.floor(1000000 * Math.random()))
        if (socket && socket.readyState === WebSocket.OPEN) {  // Check if socket is open
            if (user) {
                const message = {
                    user: user,
                    session: true
                };
                socket.send(JSON.stringify(message));  // Send as JSON string once connection is open
            }
        } else {
            console.log("WebSocket is not open.");
        }
        try {
            const response = await fetch(`https://draw-io-z8ub-backend.vercel.app/api/user/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: user, session: true, shareToken: Math.floor(1000000 * Math.random()) }),
            })
            console.log(response)
            if (!response.ok) {
                console.log("Response not ok", response)
            }
            setSessionActive(true)
            // createUserToken(setUser)
        } catch (error) {
            console.log(error)
        }
    }

    async function CloseSession() {
        // const socket = new WebSocket('ws://localhost:8080');
        // socket.onopen = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {  // Check if socket is open
            if (user) {
                const message = {
                    user: user,
                    session: false
                };
                console.log("msg sent ot websocket", message)
                socket.send(JSON.stringify(message));  // Send as JSON string once connection is open
            }
        } else {
            console.log("WebSocket is not open.");
        }

        // Optionally, handle WebSocket errors
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        try {
            const response = await fetch(`https://draw-io-z8ub-backend.vercel.app/api/user/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: user, session: false }),
            });
            console.log(response);
            if (!response.ok) {
                console.log("Response not ok", response);
            }
            setSessionActive(false);
            // setSocket(false)
            // createUserToken(setUser)
        } catch (error) {
            console.log(error);
        }
    }


    // return (
    //     <div ref={ShareWidgetRef} className="share-widget">
    //         <p>You need to share this link</p>
    //         <div className='text-area-copy-parent'>
    //             <textarea className='text-area' cols="1" rows="1">{`https://drawing.com/user=${user}`}</textarea>
    //             <Copy className="copy-button" />
    //         </div>
    //         {!sessionActive ? (
    //             <button className='Launch-button' onClick={ActivateSession}>Launch Session</button>
    //         ) : (
    //             <button className="close-button" onClick={CloseSession}>Close Session</button>
    //         )}
    //     </div>

    // )
    const handleCopy = () => {
        navigator.clipboard.writeText(`https://draw-io-z8ub-backend.vercel.app/user=${user}/session=${sessionToken}`);
        // ("Link copied to clipboard!");alert
    };
    return (
        <Box ref={ShareWidgetRef}
            sx={{
                position: "absolute",
                top: "70px",
                right: "20px",
                width: "300px",
                height: "200px",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                backgroundColor: "#f9f9f9",
                zIndex: 1000, // Ensures it stays on top
            }}
        >
            <Typography
                variant="h5"
                sx={{ marginBottom: "16px", fontWeight: "bold", color: "#333" }}
            >
                Live Collaboration
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                }}
            >
                <TextField
                    value={`https://draw-io-z8ub-backend.vercel.app/user=${user}/session=${sessionToken}`}
                    InputProps={{
                        readOnly: true,
                    }}
                    multiline
                    rows={1} // Makes the text area taller
                    fullWidth
                    variant="outlined"
                    sx={{
                        marginRight: "8px",
                        "& .MuiOutlinedInput-root": {
                            padding: "10px", // Adjust padding for better visual
                        },
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleCopy}
                    sx={{
                        padding: "10px",
                    }}
                >
                    {sessionActive && <Copy />}
                </IconButton>
            </Box>
            {!sessionActive ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ActivateSession}
                    sx={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textTransform: "none",
                    }}
                >
                    Launch Session
                </Button>) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={CloseSession}
                    sx={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textTransform: "none",
                        color: "red",
                        backgroundColor: "white",
                        border: "10px"
                    }}
                >
                    Close Session
                </Button>
            )}
        </Box>
    );
}

export default ShareWidget;
