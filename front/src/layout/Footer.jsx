import "../style/Footer.css"

function Footer() {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>스터디 네트워크</h4>
                    <p>스터디 관련 정보와 자료를 제공하는 플랫폼으로, 효율적인 학습 환경을 제공합니다.</p>
                </div>
                <div className="footer-section">
                    <h4>사이트 정보</h4>
                    <ul>
                        <li>이용약관</li>
                        <li>개인정보처리방침</li>
                        <li>연락처</li>
                        <li>사이트맵</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>소셜 미디어</h4>
                    <ul>
                        <li>Facebook</li>
                        <li>Instagram</li>
                        <li>Twitter</li>
                        <li>YouTube</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>고객 지원</h4>
                    <ul>
                        <li>자주 묻는 질문</li>
                        <li>고객 지원</li>
                        <li>피드백</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 StudyHub. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer