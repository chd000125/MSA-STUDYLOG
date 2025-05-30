import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import '../style/Home.css';
import ClickableBox from "../components/ClickableBox.jsx";
import StudyCard from "../components/group/StudyCard.jsx";
import {getAllStudyGroupsPaged} from "../api/GroupServiceApi.js";
import "../style/ClickableBox.css";
import StudyCardList from "../components/group/StudyCardList.jsx";


function Home() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [birdVisible, setBirdVisible] = useState(false); // ✅ bird 등장 제어
    const [study, setStudy] = useState([]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && keyword.trim() !== "") {
            navigate(`/study/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    const handleSearchClick = () => {
        if (keyword.trim() !== "") {
            navigate(`/study/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };
    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const data = await getAllStudyGroupsPaged(0, 3);
                setStudy(data); // 받아온 데이터 저장
            } catch (err) {
                console.error('스터디 목록 불러오기 실패:', err);
            }
        };

        fetchStudies();
    }, []);

    useEffect(() => {
        // flybird 애니메이션 종료 타이밍에 맞춰 bird 표시
        const timer = setTimeout(() => {
            setBirdVisible(true);
        }, 4100); // fly-diagonal 애니메이션 시간과 맞춤

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="home-page">
            <div className="logo-wrapper">
                <img src="/images/flybird.jpg" alt="flybird" className="fly-bird" />
                <img
                    src="/images/bird.jpg"
                    className="bird-icon"
                    alt="bird"
                    style={{ opacity: birdVisible ? 1 : 0 }} // ✅ 상태로 등장 제어
                />
                <h1>STUDYLOG</h1>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="스터디 그룹을 찾아보세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="home-search-button" onClick={handleSearchClick}>
                    <img src="/images/Search.jpg" alt="검색" />
                </button>
            </div>

            <div className="click-box">
                <ClickableBox to="https://www.kyobobook.co.kr" imageSrc="/images/kyobo.png" title="교보문고" />
                <ClickableBox to="https://www.yes24.com" imageSrc="/images/yes24.png" title="YES24" />
                <ClickableBox to="https://www.riss.kr" imageSrc="/images/riss.png" title="RISS" />
                <ClickableBox to="https://www.dbpia.co.kr" imageSrc="/images/dbpia.png" title="DBpia" />
                <ClickableBox to="https://www.nl.go.kr" imageSrc="/images/nl.png" title="국립중앙도서관" />
            </div>

            {/* 🔽 최신 스터디 카드 목록 */}
            <h4 style={{ marginTop: '50px' }}>최신 스터디 모집글</h4>
            <div className="study-Card">
                <StudyCardList  />
            </div>

        </div>
    );
}

export default Home;
