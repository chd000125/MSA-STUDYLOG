import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import OpenAI from 'openai';
import StudyCard from "../../components/group/StudyCard.jsx";
import { getAllStudyGroupsPaged, getStudyGroupById } from "../../api/GroupServiceApi.js";
import { fetchCategoryList } from "../../api/boardApi.js";
import "../../style/group/StudySearch.css";
import "../../style/group/StudyCard.css";
import { useSelector, useDispatch } from 'react-redux';
import { setAiSearchToken } from '../../store/authSlice';

const MAX_TOKENS = 5;
const RESET_INTERVAL = 60 * 60 * 1000; // 1시간(ms)

function StudySearch() {
    const navigate = useNavigate();
    const location = useLocation();
    const [studies, setStudies] = useState([]);
    const [filteredStudies, setFilteredStudies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([{ id: 'all', name: '전체' }]);
    const [activeTab, setActiveTab] = useState('filter');
    const [aiSearchTerm, setAiSearchTerm] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResults, setAiResults] = useState([]);
    const [aiTokens, setAiTokens] = useState(MAX_TOKENS);
    const [aiTokenMsg, setAiTokenMsg] = useState('');

    const dispatch = useDispatch();
    const aiSearchToken = useSelector(state => state.auth.aiSearchToken);
    const user = useSelector(state => state.auth.user);
    const isGuest = !user?.uEmail;

    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });

    const locations = [
        { id: 'seoul', name: '서울' },
        { id: 'gyeonggi', name: '경기' },
        { id: 'incheon', name: '인천' },
        { id: 'daegu', name: '대구' },
        { id: 'jeju', name: '제주' },
        { id: 'busan', name: '부산' },
        { id: 'gwangju', name: '광주' },
        { id: 'gangwon', name: '강원' },
        { id: 'ulsan', name: '울산' },
        { id: 'chungbook', name: '충북' },
        { id: 'chungnam', name: '충남' },
        { id: 'daejeon', name: '대전' },
    ];

    useEffect(() => {
        // URL에서 검색어 파라미터 가져오기
        const searchParams = new URLSearchParams(location.search);
        const keyword = searchParams.get('keyword');
        if (keyword) {
            setSearchTerm(keyword);
        }

        const fetchStudies = async () => {
            setIsLoading(true);
            try {
                const response = await getAllStudyGroupsPaged(0, 15);
                const data = response.data.content;
                setStudies(data);
                setFilteredStudies(data);
            } catch (error) {
                console.error('❌ 스터디 데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetchCategoryList();
                const serverCategories = res.data.map(c => ({
                    id: c.category.toLowerCase(),
                    name: c.category
                }));
                setCategories([{ id: 'all', name: '전체' }, ...serverCategories]);
            } catch (error) {
                console.error('❌ 카테고리 불러오기 실패:', error);
            }
        };

        fetchStudies();
        fetchCategories();
    }, [location.search]);

    // 토큰 정보 가져오기
    function getTokenInfo() {
        if (!aiSearchToken) return { count: MAX_TOKENS, lastReset: Date.now() };
        return JSON.parse(aiSearchToken);
    }

    // 토큰 정보 저장
    function setTokenInfo(info) {
        dispatch(setAiSearchToken(JSON.stringify(info)));
    }

    // 토큰 사용 시 호출
    function useToken() {
        let info = getTokenInfo();
        const now = Date.now();
        if (now - info.lastReset > RESET_INTERVAL) {
            info = { count: MAX_TOKENS, lastReset: now };
        }
        if (info.count <= 0) return false;
        info.count -= 1;
        setTokenInfo(info);
        setAiTokens(info.count);
        return true;
    }

    // 남은 토큰 수 반환
    function getTokenCount() {
        let info = getTokenInfo();
        const now = Date.now();
        if (now - info.lastReset > RESET_INTERVAL) {
            info = { count: MAX_TOKENS, lastReset: now };
            setTokenInfo(info);
        }
        return info.count;
    }

    // 컴포넌트 마운트 시 토큰 수 갱신
    useEffect(() => {
        setAiTokens(getTokenCount());
    }, [activeTab, aiSearchToken]);

    // 1분마다 토큰 자동 갱신
    useEffect(() => {
        const interval = setInterval(() => {
            setAiTokens(getTokenCount());
        }, 60000);
        return () => clearInterval(interval);
    }, [aiSearchToken]);

    const handleAiSearch = async () => {
        if (!aiSearchTerm.trim()) return;
        // 토큰 체크
        if (!useToken()) {
            setAiTokenMsg('AI 검색은 1시간에 최대 5번만 가능합니다. 잠시 후 다시 시도해주세요.');
            return;
        } else {
            setAiTokenMsg('');
        }
        setAiLoading(true);
        try {
            const prompt = `
                아래는 스터디 목록입니다.
                ${JSON.stringify(studies)}
                
                "${aiSearchTerm}"에 가장 적합한 스터디 10개만 골라주세요.
                - 사용자가 입력한 주요 키워드(예: '자바스크립트', 'JS', 'JavaScript' 등)가 스터디명, 설명, 카테고리 등에 포함되어 있으면 우선적으로 추천하세요.
                - 키워드가 정확히 일치하지 않더라도, 비슷한 주제나 관련성이 높은 스터디도 함께 추천하세요.
                - 사용자가 원하는 요구 사항(오프라인/온라인, 지역, 요일 등)도 최대한 반영하세요.
                - 적합한 스터디가 없다면 빈 배열을 반환하세요.
                - id는 반드시 위 목록에 있는 id만 사용하세요.
                - 아무 설명도 하지 말고, 반드시 아래와 같이 JSON만 반환하세요.
                [
                  { "id": 1 },
                  { "id": 2 }
                ]
            `;

            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4o-mini",
            });

            const responseText = completion.choices[0].message.content;
            console.log('AI 원본 응답:', responseText);

            // 코드블록 제거 및 JSON 추출
            let cleaned = responseText.replace(/```json|```/g, '').trim();
            let jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            
            if (!jsonMatch) {
                setAiResults([]);
                setFilteredStudies([]);
                setAiLoading(false);
                setAiTokenMsg('AI 응답을 이해하지 못했습니다. 다시 시도해 주세요.');
                return;
            }

            try {
                const response = JSON.parse(jsonMatch[0]);
                console.log('파싱된 JSON:', response);

                // 배열 응답 처리
                if (Array.isArray(response)) {
                    if (response.length === 0) {
                        setAiResults([]);
                        setFilteredStudies([]);
                        setAiLoading(false);
                        return;
                    }
                    
                    // 배열의 첫 번째 항목에서 id 추출
                    const id = response[0].id;
                    const validId = id && studies.some(study => String(study.id) === String(id));
                    if (!validId) {
                        setAiResults([]);
                        setFilteredStudies([]);
                        setAiLoading(false);
                        return;
                    }

                    const detailPromise = getStudyGroupById(id);
                    const detailResponse = await detailPromise;
                    const matchedStudy = detailResponse.data;
                    
                    setAiResults([matchedStudy]);
                    setFilteredStudies([matchedStudy]);
                    return;
                }

                // 단일 객체 응답 처리
                const id = response.id;
                const validId = id && studies.some(study => String(study.id) === String(id));
                if (!validId) {
                    setAiResults([]);
                    setFilteredStudies([]);
                    setAiLoading(false);
                    return;
                }

                const detailPromise = getStudyGroupById(id);
                const detailResponse = await detailPromise;
                const matchedStudy = detailResponse.data;
                
                setAiResults([matchedStudy]);
                setFilteredStudies([matchedStudy]);
            } catch (error) {
                console.error('❌ AI 검색 실패:', error);
                setAiResults([]);
                setFilteredStudies([]);
                setAiTokenMsg('AI 응답 파싱에 실패했습니다. 다시 시도해 주세요.');
            } finally {
                setAiLoading(false);
            }
        } catch (error) {
            console.error('❌ AI 검색 실패:', error);
        }
    };

    useEffect(() => {
        let filtered = studies;

        if (searchTerm) {
            filtered = filtered.filter(study =>
                study.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                study.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category !== 'all') {
            filtered = filtered.filter(study => study.category?.toLowerCase() === category);
        }

        if (locationFilter !== 'all') {
            filtered = filtered.filter(study => study.location === locationFilter);
        }

        switch (sortBy) {
            case 'members':
                filtered.sort((a, b) => b.currentMember - a.currentMember);
                break;
            case 'startDate':
                filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                break;
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredStudies(filtered);
    }, [searchTerm, category, locationFilter, sortBy, studies]);

    const handleStudyClick = (studyId) => {
        window.open(`/study/${studyId}`, '_blank');
    };

    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    return (
        <>
            <button className="study-create-btn" onClick={()=> navigate("/study/create")}>스터디 생성</button>
            <div className="sub-header">
                <h2>지금 모집 중인 스터디 그룹</h2>
                <p>함께 공부할 사람들을 찾고 계신가요? 관심 있는 스터디를 지금 바로 찾아보세요.</p>
            </div>

            <div className="study-search-container">
                <aside className="search-sidebar">
                    <div className="search-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'filter' ? 'active' : ''}`}
                            onClick={() => setActiveTab('filter')}
                        >
                            필터 검색
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ai')}
                        >
                            AI 검색
                        </button>
                    </div>

                    {activeTab === 'filter' ? (
                        <>
                            <h3 className="filter-title">필터 검색</h3>
                            <input
                                type="text"
                                placeholder="스터디명 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="filter-input"
                            />

                            <div className="filter-group">
                                <label>카테고리</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>지역</label>
                                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="ai-search-input-container">
                                <div className="ai-search-header">
                                    <h3 className="filter-title">AI 검색</h3>
                                    <div className="ai-token-info">
                                        남은 AI 검색 횟수: {aiTokens} / 5
                                    </div>
                                </div>
                                <textarea
                                    placeholder="원하는 스터디를 자유롭게 설명해주세요. "
                                    value={aiSearchTerm}
                                    onChange={(e) => setAiSearchTerm(e.target.value)}
                                    className="ai-search-input"
                                />
                                {aiTokenMsg && (
                                    <div className="ai-token-msg">
                                        {aiTokenMsg}
                                    </div>
                                )}
                                <button 
                                    className="ai-search-btn"
                                    onClick={handleAiSearch}
                                    disabled={aiLoading || aiTokens === 0 || isGuest}
                                >
                                    {aiLoading ? '검색 중...' : '검색'}
                                </button>
                            </div>
                            {isGuest && (
                                <div className="ai-guest-msg">
                                    AI 검색은 로그인 후 이용 가능합니다.
                                </div>
                            )}
                        </>
                    )}
                </aside>

                <div className="study-content-column">
                    <div className="recommendation-box">
                        {activeTab === 'ai' ? (
                            aiLoading ? (
                                <>
                                    <div className="message">AI가 스터디를 찾고 있습니다...</div>
                                    <div className="ai-hint">잠시만 기다려주세요.</div>
                                </>
                            ) : aiResults.length > 0 ? (
                                <>
                                    <div className="message">AI가 추천한 스터디입니다.</div>
                                    <div className="ai-hint">입력하신 조건과 유사한 스터디를 보여드려요.</div>
                                </>
                            ) : aiSearchTerm.trim() ? (
                                <>
                                    <div className="message">AI 추천 결과가 없습니다.</div>
                                    <div className="ai-hint">조건을 바꿔 다시 검색해보세요.</div>
                                </>
                            ) : (
                                <>
                                    <div className="message">AI 검색을 이용해 원하는 스터디를 찾아보세요.</div>
                                    <div className="ai-hint">왼쪽 입력창에 원하는 스터디 조건을 자유롭게 입력해보세요.</div>
                                </>
                            )
                        ) : (
                            <>
                                <div className="message">필터를 이용해 원하는 스터디를 찾아보세요.</div>
                                <div className="ai-hint">왼쪽 입력창에서 조건을 선택해 검색할 수 있습니다.</div>
                            </>
                        )}
                    </div>

                    <div className="study-main-list">
                        {filteredStudies.length === 0 ? (
                            <div className="no-results">
                                {activeTab === 'ai'
                                    ? '적합한 스터디 그룹을 찾지 못했습니다.'
                                    : '검색 결과가 없습니다.'}
                            </div>
                        ) : (
                            filteredStudies.map(study => (
                                <StudyCard
                                    key={study.id}
                                    study={study}
                                    categories={categories}
                                    locations={locations}
                                    onClick={() => handleStudyClick(study.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudySearch;
