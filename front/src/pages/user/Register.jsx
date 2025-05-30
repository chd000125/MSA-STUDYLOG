import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from "../../api/api";
import "../../style/user/Register.css";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        uName: '',
        uEmail: '',
        uPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === "confirmPassword" || name === "uPassword") {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('회원가입 시도:', formData);

        if (formData.uPassword !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            console.log('회원가입 API 호출 전');
            // 회원가입 요청 (백엔드에서 RegisterDto로 저장)
            const response = await API.auth.requestRegister({
                uName: formData.uName,
                uEmail: formData.uEmail,
                uPassword: formData.uPassword
            });
            console.log('회원가입 API 응답:', response);

            // 이메일 인증 페이지로 이동
            console.log('이메일 인증 페이지로 이동 시도');
            try {
                const emailVerificationPath = `/email-verification?uEmail=${encodeURIComponent(formData.uEmail)}`;
                console.log('이동할 경로:', emailVerificationPath);
                navigate(emailVerificationPath, { replace: true });
            } catch (navigationError) {
                console.error('페이지 이동 중 오류 발생:', navigationError);
                setError('페이지 이동 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
            if (error.response) {
                setError(error.response.data.error || error.response.data.message || "회원가입 요청 실패");
            } else {
                setError("회원가입 요청 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <>
            <div className="login-header">
                <h1 className="tone1">StudyLog</h1>
                <p className="tone1">회원가입 정보를 입력해주세요</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="uEmail">이메일</label>
                    <input
                        type="email"
                        id="uEmail"
                        name="uEmail"
                        placeholder="Enter your email"
                        className="input1"
                        value={formData.uEmail}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="uPassword">비밀번호</label>
                    <input
                        type="password"
                        id="uPassword"
                        name="uPassword"
                        placeholder="Enter your password"
                        className="input1"
                        value={formData.uPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className="input1"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="uName">이름</label>
                    <input
                        type="text"
                        id="uName"
                        name="uName"
                        placeholder="Enter your name"
                        className="input1"
                        value={formData.uName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn">회원가입</button>
            </form>

        </>
    );
}

export default Register;