import { v4 as uuidv4 } from 'uuid';
const createUserToken = async ({ setUser }) => {
    console.log("createing token")
    let token = localStorage.getItem("drawingToken");
    if (!token) {
        token = uuidv4();
        localStorage.setItem("drawingToken", token);
        console.log("New token generated:", token);
        await fetch("https://draw-io-z8ub-backend.vercel.app/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, session: false }),
        });
    } else {
        console.log("Existing token found:", token);
    }
    setUser(token);
};

export default createUserToken