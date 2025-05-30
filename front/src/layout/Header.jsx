import "../style/Header.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { API } from '../api/api';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
    const user = useSelector(state => state.auth);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(user?.user?.uRole === "ADMIN");
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            // 서버 측 로그아웃 처리
            await API.auth.logout();
            
            // Redux store 업데이트
            dispatch(logout());
            // 로컬 상태 업데이트
            setIsLoggedIn(false);
            setIsAdmin(false);
            // 페이지 이동
            navigate("/");
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
            // 오류가 발생하더라도 클라이언트 측 로그아웃은 수행
            dispatch(logout());
            setIsLoggedIn(false);
            setIsAdmin(false);
            navigate("/");
        }
    };

    return (
        <div className="header">
            <h1 onClick={() => navigate("/")} className="home-logo">
                STUDYLOG
            </h1>
            <nav className="nav-menu">
                <span onClick={() => navigate("/study/search")}>스터디</span>
                <span onClick={() => navigate("/board")}>게시판</span>
            </nav>
            <div className="header-buttons">
                {isAdmin && (
                    <button onClick={() => navigate("/admin")}>관리자</button>
                )}
                {isLoggedIn ? (
                    <>
                        <button onClick={() => navigate("/mypage")}>마이페이지</button>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <button onClick={() => navigate("/login")}>로그인</button>
                )}
            </div>
        </div>
    );
}

export default Header;
