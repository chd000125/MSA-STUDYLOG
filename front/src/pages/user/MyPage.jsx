import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../store/authSlice';
import { getManagedGroups, getJoinedGroups } from '../../api/GroupServiceApi';
import { API } from '../../api/api';
import MyInfoSection from "./MyInfoSection.jsx";
import StudyGroupSection from "../group/StudyGroupSection.jsx";
import MyPostsSection from "../board/MyPostsSection.jsx";
import DeleteAccountSection from "./DeleteAccountSection.jsx";
import "../../style/user/MyPage.css"

const MyPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedMenu, setSelectedMenu] = useState('info');
    const [managedGroups, setManagedGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.user.getProfile();
                const userData = {
                    uName: response.data.uName,
                    uEmail: response.data.uEmail,
                    uRole: response.data.uRole,
                    deletedAt: response.data.deletedAt
                };

                dispatch(updateUserInfo(userData));
                await fetchStudyGroups(userData.uEmail);
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                if (error.response?.status === 401) {
                    alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/login");
                }
            }
        };

        const fetchStudyGroups = async (uEmail) => {
            try {
                const [managedRes, joinedRes] = await Promise.all([
                    getManagedGroups(uEmail, 0, 10),
                    getJoinedGroups(uEmail, 0, 10)
                ]);

                setManagedGroups(managedRes.data.content);
                setJoinedGroups(joinedRes.data.content);
            } catch (error) {
                console.error('스터디 그룹 요청 실패:', error);
                setError('스터디 그룹 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchUserData();
        fetchStudyGroups();
    }, [dispatch, navigate]);

    if (!user) return <div>로딩 중...</div>;

    return (
        <div className="mypage-wrapper">
            <nav className="sidebar">
                <h2>마이페이지</h2>
                <ul>
                    <li className={selectedMenu === 'info' ? 'active' : ''} onClick={() => setSelectedMenu('info')}>내 정보</li>
                    <li className={selectedMenu === 'study' ? 'active' : ''} onClick={() => setSelectedMenu('study')}>스터디 그룹</li>
                    <li className={selectedMenu === 'post' ? 'active' : ''} onClick={() => setSelectedMenu('post')}>내 게시글</li>
                    <li className={selectedMenu === 'delete' ? 'active' : ''} onClick={() => setSelectedMenu('delete')}>회원 탈퇴</li>
                </ul>
            </nav>
            <main className="main-content">
                {selectedMenu === 'info' && <MyInfoSection />}
                {selectedMenu === 'study' && (<StudyGroupSection/>)}
                {selectedMenu === 'post' && <MyPostsSection email={user.uEmail} />}
                {selectedMenu === 'delete' && <DeleteAccountSection />}
            </main>
        </div>
    );
};

export default MyPage;
