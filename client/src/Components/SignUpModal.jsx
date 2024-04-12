import { useState } from "react";
import "./SignUpModal.css";



const SignUpModal = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform sign-up logic here
        // Once sign-up is successful, close the modal
        closeModal();
    };

    const handleClose = () => {
      closeModal();
    }

 

    return (
        <div className={`modal-1-overlay open`}>
            <div className="modal-1-modal">
                <header>
                    <h2>Sign Up</h2>
                    <h3>Try Hologram today</h3>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="textbox">
                        <span className="material-symbols-outlined">account_circle</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="textbox">
                        <span className="material-symbols-outlined">lock</span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="signup-button" type="submit">
                        Sign up
                    </button>
                    <button className="cancel-button" type="button" onClick={handleClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpModal;


