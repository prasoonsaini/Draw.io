import React from "react";
import './share.css'
const NotificationButton = ({ label, notificationCount }) => {
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <button
                className="share-button"
            >
                {label}
            </button>
            {notificationCount > 0 && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "-5px",
                        right: "-5px",
                        backgroundColor: "red",
                        color: "white",
                        fontSize: "12px",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "2px solid white",
                        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                    }}
                >
                    {notificationCount}
                </span>
            )}
        </div>
    );
};

export default NotificationButton;
