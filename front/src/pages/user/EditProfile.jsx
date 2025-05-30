import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../store/authSlice';
import "../../style/user/MyPage.css";
import { API } from "../../api/api";

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [formData, setFormData] = useState({
        uName: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                uName: user.uName
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 이름 업데이트 API 호출
            const response = await API.user.updateName({ uName: formData.uName });
            
            if (response.data) {
                // Redux store 업데이트
            dispatch(updateUserInfo({
                uName: formData.uName,
                uEmail: user.uEmail,
                uRole: user.uRole
            }));

            alert('프로필이 성공적으로 업데이트되었습니다.');
            navigate('/mypage');
            }
        } catch (error) {
            console.error('프로필 업데이트 실패:', error);
            setError(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
        }
    };

    if (!user) {
        return (
            <div className="edit-profile-container">
                <p>로그인이 필요합니다.</p>
                <button onClick={() => navigate('/login')}>로그인</button>
            </div>
        );
    }

    return (
        <div className="mypage-container">
            <h2 className="mypage-header">회원정보 수정</h2>
            <form onSubmit={handleSubmit} className="edit-form">
                    <h3>회원정보 수정</h3>
                    <div className="form-group">
                        <label>이름</label>
                        <input
                            type="text"
                            name="uName"
                        value={formData.uName}
                        onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>이메일</label>
                        <input
                            type="email"
                        value={user.uEmail}
                            disabled
                            className="disabled-input"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="button-group">
                        <button type="submit">저장</button>
                        <button type="button" onClick={() => navigate('/mypage')}>취소</button>
                    </div>
                </form>
        </div>
    );
};

export default EditProfile; 