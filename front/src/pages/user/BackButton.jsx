// components/BackButton.jsx
import { FaArrowLeft } from 'react-icons/fa';
import "../style/AuthPage.css"

function BackButton({ onClick }) {
    return (
        <button className="back-button2" onClick={onClick}>
            <FaArrowLeft style={{ marginRight: '6px' }} />
        </button>
    );
}

export default BackButton;
