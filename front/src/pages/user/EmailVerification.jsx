import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../../api/api';
import "../../style/user/EmailVerification.css";

const EmailVerification = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('uEmail');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 인증 코드 확인
            await API.auth.verifyCode(email, verificationCode);

            // 회원가입 완료 요청: 이메일만 JSON 객체로 전송
            await API.auth.requestRegisterComplete({ email });

            alert('이메일 인증이 완료되었습니다. 로그인해주세요.');
            navigate('/login');
        } catch (error) {
            console.error('이메일 인증 또는 회원가입 완료 실패:', error);
            setError(error.response?.data?.message || '이메일 인증 또는 회원가입 완료에 실패했습니다.');
        }
    };

    const handleResendCode = async () => {
        if (isResending) return;
        setIsResending(true);
        setError('');

        try {
            await API.auth.sendVerificationCode(email);
            alert('인증 코드가 재전송되었습니다.');
        } catch (error) {
            console.error('인증 코드 재전송 실패:', error);
            setError(error.response?.data?.message || '인증 코드 재전송에 실패했습니다.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="email-verification-wrapper">
            <div className="email-verification-inner">
                <h2 className="email-logo" onClick={() => navigate("/")}>STUDYLOG</h2>
                <form onSubmit={handleVerifyCode} className="email-verification-form">
                    <h3>이메일 인증</h3>
                    <p className="email-info">{email}로 전송된 인증 코드를 입력해주세요.</p>

                    <label htmlFor="verificationCode">인증 코드</label>
                    <input
                        type="text"
                        id="verificationCode"
                        name="verificationCode"
                        placeholder="인증 코드 입력"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit">인증 코드 확인</button>
                    <button type="button" onClick={handleResendCode} className="resend-button">
                        인증 코드 재전송
                    </button>

                    <p onClick={() => navigate("/register")} className="back-link">
                        회원가입으로 돌아가기
                    </p>
                </form>
            </div>
        </div>
    );
};

export default EmailVerification;