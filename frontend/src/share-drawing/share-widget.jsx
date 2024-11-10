import { useLocation } from 'react-router-dom'
import './share.css'
import { useEffect, useState } from 'react'

function ShareWidget({ user, sessionActive, setSessionActive }) {

    useEffect(() => {
        if (!user)
            return
        async function getSession() {
            try {
                console.log("user in share widget", user)
                const response = await fetch(`http://localhost:3010/api/user/${user}`, {
                    method: 'GET'
                })
                const data = await response.json()
                console.log("data data", data.message)
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
    }, [user])

    console.log("user", user)
    console.log("session active", sessionActive)

    async function ActivateSession() {
        try {
            const response = await fetch(`http://localhost:3010/api/user/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: user, session: true }),
            })
            console.log(response)
            if (!response.ok) {
                console.log("Response not ok", response)
            }
            setSessionActive(true)
        } catch (error) {
            console.log(error)
        }
    }

    async function CloseSession() {
        try {
            const response = await fetch(`http://localhost:3010/api/user/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: user, session: false }),
            })
            console.log(response)
            if (!response.ok) {
                console.log("Response not ok", response)
            }
            setSessionActive(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="share-widget">
            <p>You need to share this link</p>
            <textarea className='text-area' cols="1" rows="1">https://drawing.com/dasdsdfwe242dsd</textarea>
            {!sessionActive ? (
                <button className='Launch-button' onClick={ActivateSession}>Launch Session</button>
            ) : (
                <button className="close-button" onClick={CloseSession}>Close Session</button>
            )}
        </div>
    )
}

export default ShareWidget;
