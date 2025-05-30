// ✅ 개선된 AuthPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Login from './Login';
import Register from './Register';
import '../../style/user/AuthPage.css';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-page-wrapper">
        <div className="auth-wrapper">
            {/* 왼쪽 사이드 영역 */}
            <div className="auth-left">
                <div className="auth-message">
                    <h2>{isLogin ? '스터디 시작해볼까요' : '스터디 시작해볼까요'}</h2>
                    <p>{isLogin ? '계정이 없으신가요?' : '계정이 있으신가요?'}</p>
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? '회원가입' : '로그인'}
                    </button>
                </div>
            </div>

            {/* 오른쪽 슬라이딩 영역 */}
            <div className="auth-right">
                <motion.div
                    className="form-slider"
                    animate={{ x: isLogin ? '0%' : '-50%' }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="form-panel">
                        <Login onSwitch={() => setIsLogin(false)} />
                    </div>
                    <div className="form-panel">
                        <Register onSwitch={() => setIsLogin(true)} />
                    </div>
                </motion.div>
            </div>
        </div>
        </div>
    );
}

export default AuthPage;
