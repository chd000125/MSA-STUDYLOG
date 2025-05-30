import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../style/user/MyPage.css';

const MyInfoSection = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);

    if (!user) return <div>로딩 중...</div>;

    return (
        <div className="user-info-section">
            <h3>내 정보</h3>
            <div className="user-info">
                <p><strong>이름:</strong> {user.uName}</p>
                <p><strong>이메일:</strong> {user.uEmail}</p>
            </div>
            <div className="button-group">
                <button className="edit-button" onClick={() => navigate('/mypage/edit')}>정보 수정</button>            
            </div>
        </div>
    );
};

export default MyInfoSection; 