import './share.css';

function ShareButton({ setShare, sessionActive, notificationCount }) {
    function handleClick() {
        setShare(true);
    }

    return (
        <div style={{ position: "absolute", top: "5px", right: "10px" }}>
            {!sessionActive ? (
                <button className="share-button" onClick={handleClick} style={{ position: "relative" }}>
                    Share
                </button>
            ) : (
                <button className="sharing-button" onClick={handleClick} style={{ position: "relative" }}>
                    Sharing
                </button>
            )}
            {sessionActive && notificationCount > 0 && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "-25px",
                        right: "-1px",
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
}

export default ShareButton;
