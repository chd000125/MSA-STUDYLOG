// components/ResetPasswordModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/user/Modal1.css';
import { API } from "../../api/api";

const ResetPassword = ({ onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증코드 입력, 3: 새 비밀번호 입력
    const [uEmail, setUEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            await API.auth.sendVerificationCode(uEmail);
            setStep(2);
            alert('비밀번호 재설정 코드가 이메일로 전송되었습니다.');
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || '인증 코드 전송에 실패했습니다.');
            } else {
                alert('인증 코드 전송에 실패했습니다.');
            }
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            await API.auth.verifyCode(uEmail, verificationCode);
            setStep(3);
        } catch (error) {
            alert(error.response?.data?.message || '인증 코드가 일치하지 않습니다.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await API.user.resetPassword({ uEmail, verificationCode, newPassword });
            alert('비밀번호가 성공적으로 재설정되었습니다.');
            onClose();
            navigate('/login');
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.error || '비밀번호 재설정에 실패했습니다.');
            } else {
                alert('비밀번호 재설정에 실패했습니다.');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>

                {step === 1 && (
                    <>
                        <h3>이메일 인증</h3>
                        <input 
                            type="email" 
                            placeholder="이메일 입력" 
                            value={uEmail} 
                            onChange={(e) => setUEmail(e.target.value)}
                            className="modal-input"
                        />
                        <button 
                            onClick={handleSendVerificationCode} 
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? '처리 중...' : '인증 코드 전송'}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3>인증 코드 확인</h3>
                        <input 
                            type="text" 
                            placeholder="인증 코드" 
                            value={verificationCode} 
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="modal-input"
                        />
                        <button 
                            onClick={handleVerifyCode} 
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? '처리 중...' : '확인'}
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3>새 비밀번호 입력</h3>
                        <input 
                            type="password" 
                            placeholder="새 비밀번호" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="modal-input"
                        />
                        <input 
                            type="password" 
                            placeholder="비밀번호 확인" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="modal-input"
                        />
                        <button 
                            onClick={handleResetPassword} 
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? '처리 중...' : '비밀번호 변경'}
                        </button>
                    </>
                )}

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;
