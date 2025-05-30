import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/group/StudyDetail.css';
import {
    getStudyGroupById,
    getStudyDetail,
    getCurriculumsByStudy,
    applyToStudy
} from '../../api/GroupServiceApi'; // ✅ 그룹 API 연결


function StudyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [study, setStudy] = useState(null);
    const [detail, setDetail] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoined, setIsJoined] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinMessage, setJoinMessage] = useState('');

    // ✅ 로그인한 사용자 정보 파싱
    const userState = JSON.parse(localStorage.getItem('userState'));
    const user = userState && userState.user
        ? (typeof userState.user === 'string' ? JSON.parse(userState.user) : userState.user)
        : null;
    const userName = user?.uName;
    const userEmail = user?.uEmail;

    useEffect(() => {
        const fetchStudyData = async () => {
            setIsLoading(true);
            try {
                const [groupRes, detailRes, curriculumRes] = await Promise.all([
                    getStudyGroupById(id),
                    getStudyDetail(id),
                    getCurriculumsByStudy(id, 0, 50)
                ]);

                console.log("study", groupRes.data);
                console.log("syudy2", detailRes.data);

                setStudy(groupRes.data);
                setDetail(detailRes.data);
                setCurriculum(curriculumRes.data.content || []);
            } catch (err) {
                console.error('스터디 상세 정보 로딩 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudyData();
    }, [id]);


    const handleJoinClick = () => {
        if (!user) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
            return;
        }
        setShowJoinModal(true);
    };

    console.log("✅ 유저 정보:", user);
    console.log("✅ 이름:", user?.name); // 또는 user?.uName, user?.username 등

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user || !user.uEmail) {
                alert('로그인이 필요합니다.');
                return;
            }

            await applyToStudy(id, userEmail, userName);

            setIsJoined(true);
            setShowJoinModal(false);
            alert('스터디 참여 신청이 완료되었습니다.');
        } catch (error) {
            console.error('참여 신청 실패:', error.response?.data || error.message);
            alert(error.response?.data?.message || '참여 신청 중 오류가 발생했습니다.');
        }
    };


    if (isLoading) return <div className="loading">로딩 중...</div>;
    if (!study || !detail) return <div className="not-found">스터디를 찾을 수 없습니다.</div>;

    return (
        <div className="study-detail">
            <div className="study-header">
                <h1>{study.title}</h1>
                <div className="study-meta">
                    <span className="category">{study.category}</span>
                    <span className="location">{study.location}</span>
                    <span className="members">{study.currentMember}/{study.maxMember}명</span>
                </div>
            </div>

            <div className="study-content">
                <div className="study-main">
                    <section className="study-info">
                        <h2>스터디 소개</h2>
                        <p>{study.description}</p>
                    </section>

                    <section className="study-schedule">
                        <h2>모임 일정</h2>
                        <p>방식: {study.meetingType === 'online' ? '온라인' : '오프라인'}</p>
                        <p>요일: {Array.isArray(study.meetingDay) ? study.meetingDay.join(', ') : ''}</p>
                        <p>시간: {study.meetingTime}</p>
                        <p>기간: {study.startDate} ~ {study.endDate}</p>
                    </section>

                    <section className="study-curriculum">
                        <h2>커리큘럼</h2>
                        {curriculum.map((week, idx) => (
                            <div key={idx} className="curriculum-week">
                                <h3>{week.week}주차: {week.title}</h3>
                                <ul>
                                    {Array.isArray(week.topics) && week.topics.map((topic, i) => (
                                        <li key={i}>{topic}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section className="study-requirements">
                        <h2>참여 조건</h2>
                        <ul>
                            {Array.isArray(detail.requirements) && detail.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="study-tools">
                        <h2>사용 도구</h2>
                        <ul>
                            {Array.isArray(detail.tools) && detail.tools.map((tool, idx) => (
                                <li key={idx}>{tool}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="study-sidebar">
                    <h2>스터디장</h2>
                    <p> <strong>{study.uname}</strong> 님</p>

                    {/* ✅ 참여하기 조건: 미신청 && 인원 초과 아님 */}
                    {!isJoined && study.currentMember < study.maxMember && (
                        <button className="join-button" onClick={handleJoinClick}>
                            참여하기
                        </button>
                    )}
                </div>
            </div>

            {showJoinModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>스터디 참여 신청</h2>
                        <form onSubmit={handleJoinSubmit}>
                            <textarea
                                value={joinMessage}
                                onChange={(e) => setJoinMessage(e.target.value)}
                                placeholder="참여 동기를 작성해주세요"
                                required
                            />
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setShowJoinModal(false)}>취소</button>
                                <button type="submit">신청하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudyDetail;
