
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
const fetchSessionStatus = async (userId) => {
    // const location = useLocation();
    // const params = new URLSearchParams(location.hash.slice(1));
    // const roomId = params.get('room');
    // const userId = location.pathname.includes('user=')
    //     ? location.pathname.split('user=')[1]
    //     : null;
    console.log("ddddddd", userId)
    if (userId) {

        try {
            const response = await fetch(`http://localhost:3010/api/user/${userId}`, {
                method: 'GET'
            });
            if (response.ok) {
                const data = await response.json();
                // setSessionOn(data.session || false);
                if (data.session)
                    return true;
                else return false
            }
        } catch (error) {
            console.error("Error fetching session status:", error);
            return false
        }
    }
    else
        return false
};

export default fetchSessionStatus