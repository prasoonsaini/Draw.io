import './share.css'
function ShareButton({ setShare }) {
    function handleClick() {
        setShare(true)
    }
    return (
        <div>
            <button className="share-button" onClick={handleClick}>
                Share
            </button>
        </div>
    )
}

export default ShareButton;