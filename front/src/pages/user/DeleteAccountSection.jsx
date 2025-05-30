import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {logout} from "../../store/authSlice.js";
import { API } from '../../api/api';
import '../../style/user/DeleteAccountSection.css';

function DeleteAccountSection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const user = useSelector(state => state.auth.user);

    const handleDelete = async (e) => {
        e.preventDefault();
        setError('');
        setIsDeleting(true);

        if (!window.confirm('회원 탈퇴를 신청하시겠습니까? 30일간 보관되며, 이내 로그인 시 취소됩니다. 이후 계정은 삭제됩니다.')) {
            setIsDeleting(false);
            return;
        }

        try {
            // 비밀번호 확인
            const checkResponse = await API.user.checkPassword({ rawPassword: password });
            
            if (checkResponse.data.verified) {
                // 계정 비활성화 요청
                await API.user.deactivateAccount({ uEmail: user.uEmail });
                
                dispatch(logout());
                alert('회원 탈퇴가 신청되었습니다.');
                navigate('/');
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || '회원 탈퇴에 실패했습니다.');
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="account-danger-zone">
            <h3>회원 탈퇴</h3>
            <form className="delete-form" onSubmit={handleDelete}>
                <p>비밀번호를 입력하여 탈퇴를 확인하세요.</p>
                <p className="delete-notice">* 회원 탈퇴 신청 후 30일 동안 계정이 보관되며, 이 기간 동안 로그인하면 탈퇴를 취소할 수 있습니다.</p>
                <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="비밀번호를 입력하세요"
                    required 
                />
                {error && <div className="error-message">{error}</div>}
                <div className="button-group">
                    <button type="submit" className="delete-confirm-button">탈퇴하기</button>
                </div>
            </form>
        </div>
    );
}

export default DeleteAccountSection;