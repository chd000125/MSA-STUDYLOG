// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import ResetPassword from './ResetPassword';
import { API } from "../../api/api";
import "../../style/user/Login.css";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        uEmail: '',
        uPassword: ''
    });
    const [error, setError] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.auth.login({
                uEmail: formData.uEmail,
                uPassword: formData.uPassword
            });

            const userData = {
                uName: response.data.uName,
                uEmail: response.data.uEmail,
                uRole: response.data.uRole,
                accessToken: response.data.accessToken,
                deletedAt: response.data.deletedAt
            };

            if (response.data.deletedAt) {
                const confirmRestore = window.confirm("비활성화된 계정입니다. 계정을 복구하시겠습니까?");
                if (confirmRestore) {
                    navigate('/restore-account', { state: { uEmail: formData.uEmail } });
                }
                return;
            }

            dispatch(loginSuccess(userData));
            navigate('/');
        } catch (err) {
            console.error('로그인 에러:', err);
            if (err.response) {
                if (err.response.status === 401) {
                    setError("이메일 또는 비밀번호가 올바르지 않습니다.");
                } else if (err.response.status === 403) {
                    setError("비활성화된 계정입니다.");
                    navigate('/restore-account', { state: { uEmail: formData.uEmail } });
                } else {
                    setError(err.response.data.message || "로그인 중 오류가 발생했습니다.");
                }
            } else {
                setError("서버에 연결할 수 없습니다.");
            }
        }
    };

    
    return (
        <>
             <div className="login-header">
                <h1 className="tone1">StudyLog</h1>
                <p className="tone1">계정을 등록해주세요</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>이메일</label>
                    <div className="input-icon">
                        <i className="fas fa-envelope"></i>
                        <input
                         type="email"
                         name="uEmail"
                         style={{border:"none"}}
                         placeholder="이메일을 입력해주세요"
                         value={formData.uEmail}
                         onChange={handleChange}
                        required
                        />
                   </div>
                 </div>

                <div className="form-group">
                    <label>비밀번호</label>
                    <div className="input-icon">
                        <i className="fas fa-lock"></i>
                         <input
                        type="password"
                        name="uPassword"
                        style={{border:"none"}}
                        placeholder="Enter your password"
                        value={formData.uPassword}
                        onChange={handleChange}
                        required
                         />
                    </div>
                </div>

                <div className="form-options">
                    <span onClick={() => setShowResetModal(true)} className="link">비밀번호 재설정
                    </span>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn">로그인</button>
            </form>

            {showResetModal && (
                <ResetPassword onClose={() => setShowResetModal(false)} />
            )}


        </>

    );
}

export default Login;