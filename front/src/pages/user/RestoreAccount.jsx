import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/user/RestoreAccount.css';
import { API } from "../../api/api";

const RestoreAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [uEmail] = useState(location.state?.uEmail || '');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            await API.auth.sendVerificationCode(uEmail);
            setStep(2);
        } catch (error) {
            console.error('메일 인증 에러:', error);
            alert(error.response?.data?.message || '인증 코드 전송에 실패했습니다.');
        }
    };

    const handleVerifyAndRestore = async (e) => {
        e.preventDefault();
        try {
            const verifyResponse = await API.auth.verifyCode(uEmail, verificationCode);

            if (verifyResponse.status === 200) {
                const restoreResponse = await API.user.restoreAccount(uEmail);
                console.log(restoreResponse);

                if (restoreResponse.status === 200) {
                    alert(restoreResponse.data.message);
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                alert(error.response.data.error || error.response.data.message || '계정 복구에 실패했습니다.');
            } else {
                alert('서버와의 통신 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="email-verification-wrapper">
            <div className="email-verification-inner">
                <h2 className="email-logo" onClick={() => navigate("/")}>STUDYLOG</h2>
                <form onSubmit={step === 1 ? handleSendVerificationCode : handleVerifyAndRestore} className="email-verification-form">
                    <h3>계정 복구</h3>
                    {step === 1 ? (
                        <>
                            <p className="email-info">계정 복구를 위해 이메일 인증이 필요합니다.</p>
                            <label>이메일</label>
                            <input
                                type="email"
                                value={uEmail}
                                readOnly
                            />
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" disabled={loading}>
                                {loading ? '처리 중...' : '인증 코드 전송'}
                            </button>
                            <p onClick={() => navigate("/login")} className="back-link">
                                로그인 페이지로 돌아가기
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="email-info">{uEmail}로 전송된 인증 코드를 입력해주세요.</p>
                            <label>인증 코드</label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" disabled={loading}>
                                {loading ? '처리 중...' : '계정 복구하기'}
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="back-button">
                                이전으로
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RestoreAccount;