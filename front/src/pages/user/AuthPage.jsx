// 구조:
// - pages/AuthPage.jsx (전체 흐름 관리)
// - components/MainCard.jsx (로그인/회원가입 카드 선택)
// - components/AuthFormWrapper.jsx (폼 보여주는 부분)
// - components/BackButton.jsx (돌아가기 버튼)

// ✅ 1. pages/AuthPage.jsx
import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainCard from '../components/MainCard';
import AuthFormWrapper from '../components/AuthFormWrapper';
import '../../style/user/AuthPage.css';

function AuthPage() {
    const [mode, setMode] = useState('main'); // 'main' | 'login' | 'register'

    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    return (
        <div className="auth-page-wrapper">
            {mode === 'main' && <MainCard onSelect={setMode} />}
            {(mode === 'login' || mode === 'register') && (
                <AuthFormWrapper mode={mode} onBack={() => setMode('main')} />
            )}
        </div>
    );
}

export default AuthPage;
