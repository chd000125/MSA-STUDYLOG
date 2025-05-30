import React, { useState, useEffect } from 'react';
import CustomCalendar from '../../components/group/Calendar.jsx';
import TodoList from '../../components/group/TodoList';
import { getTodos } from '../../todoApi'; // 기존 투두 API 유지
import ChatRoom from '../../components/group/Chatroom.jsx';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ useNavigate 추가
import { useLocation } from 'react-router-dom'; // ✅ location import



import "../../style/group/GroupMember.css"

import {
    getStudyGroupById,
    getStudyDetail,
    getCurriculumsByStudy,
    getAcceptedMembers,
} from '../../api/GroupServiceApi'; // ✅ 그룹 서비스 API 호출



function GroupMember() {
    const { id } = useParams();
    const navigate = useNavigate(); // ✅ navigate 정의
    const [study, setStudy] = useState(null);
    const [detail, setDetail] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const location = useLocation(); // ✅ 현재 경로 정보 추적


    const userState = JSON.parse(localStorage.getItem('userState'));
    const user = typeof userState?.user === 'string'
        ? JSON.parse(userState.user)
        : userState?.user;

    const fetchMembers = async () => {
        try {
            const res = await getAcceptedMembers(id, 0, 50); // ✅ '수락' 상태 멤버만 가져옴
            setMembers(res.data.content);
        } catch (err) {
            console.error('스터디 멤버 조회 실패:', err);
        }
    };

    useEffect(() => {

        // ✅ 새 ID로 들어왔을 때, 이전 데이터 초기화
        setStudy(null);
        setDetail(null);
        setCurriculum([]);
        setMembers([]);
        setIsLoading(true);

        const fetchStudyData = async () => {
            setIsLoading(true);
            try {
                const [groupRes, detailRes, curriculumRes] = await Promise.all([
                    getStudyGroupById(id),
                    getStudyDetail(id),
                    getCurriculumsByStudy(id, 0, 50)
                ]);

                setStudy(groupRes.data);
                setDetail(detailRes.data);
                setCurriculum(curriculumRes.data.content || []);
            } catch (err) {
                console.error('스터디 상세 정보 로딩 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
        fetchStudyData();
        fetchMembers();
    }, [location.pathname]);

    const fetchTodos = async () => {
        const response = await getTodos();
        setTodos(response.data);
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (!study || !detail) return <div>스터디를 찾을 수 없습니다.</div>;



    return (
        <div className="study-page-unique">
            <div className="study-container-unique">
                <h1 className="study-title-unique">{study.title}</h1>

                {user?.uEmail === study.uemail && (
                    <div className="edit-button-wrapper-unique">
                        <button
                            className="edit-button-unique"
                            onClick={() => navigate(`/group/${id}/edit`)}
                        >
                            수정
                        </button>
                    </div>
                )}

                <div className="study-info-unique">
                    <div className="study-category-location-unique">
                        <span className="study-category-unique">{study.category}</span> |
                        <span className="study-location-unique">{study.location}</span>
                    </div>
                    <span className="study-members-unique">{study.currentMember}/{study.maxMember}명</span>
                </div>
                <div className="study-sections-unique">
                    <div className="section-unique">
                        <h2 className="section-title-unique">스터디 소개</h2>
                        <div className="section-content-unique">
                            <p className="study-description-unique">{study.description}</p>
                        </div>
                    </div>
                </div>
                <div className="study-second-unique">
                    <div className="section-unique leader-box-unique">
                        <h2 className="section-title-unique">스터디장</h2>
                        <div className="section-content-unique">
                            <div className="profile-icon">👑</div>
                            <p className="study-owner-unique">
                                {study.uname} ({study.uemail})
                            </p>
                        </div>
                    </div>

                    <div className="section-unique">
                        <h2 className="section-title-unique">스터디 팀원</h2>
                        <div className="section-content-unique">
                            {members.length > 0 ? (
                                <ul className="members-list-unique">
                                    {members
                                        .filter(m => m.userEmail !== study.uemail) // 스터디장은 제외
                                        .map((m, idx) => (
                                            <li key={idx} className="member-item-unique">
                                                👤 {m.userName} ({m.userEmail})
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p>아직 팀원이 없습니다.</p>
                            )}
                        </div>
                    </div>


                    <div className="study-schedule-unique">
                        <h2 className="section-title-unique">모임 일정</h2>
                        <div className="schedule-details-unique">
                            <p className="meeting-type-unique">방식: {study.meetingType === 'online' ? '온라인' : '오프라인'}</p>
                            <p className="meeting-day-unique">요일: {Array.isArray(study.meetingDay) ? study.meetingDay.join(', ') : ''}</p>
                            <p className="meeting-time-unique">시간: {study.meetingTime}</p>
                            <p className="study-duration-unique">기간: {study.startDate} ~ {study.endDate}</p>
                        </div>
                    </div>
                </div>

                <div className="study-features-unique">
                    <div className="tools-unique">
                        <h2 className="section-title-unique">사용 도구</h2>
                        <ul className="tools-list-unique">
                            {Array.isArray(detail.tools) && detail.tools.map((tool, idx) => (
                                <li key={idx} className="tool-item-unique">{tool}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="curriculum">
                    <h2 className="section-title">커리큘럼</h2>
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
                </div>

                <div className="todo-cont-unique">
                    <CustomCalendar onDateChange={setSelectedDate} todos={todos} />
                    <TodoList selectedDate={selectedDate} todos={todos} />
                </div>


                <div className={`chatroom-wrapper-unique ${isChatOpen ? 'open' : ''}`}>
                    <button
                        className="chat-toggle-btn-unique"
                        onClick={() => setIsChatOpen(prev => !prev)}
                    >
                        채팅
                    </button>
                    {study && user?.uEmail && user?.uName && (
                        <ChatRoom groupId={id} userEmail={user.uEmail} userName={user.uName} />
                    )}
                </div>
            </div>
        </div>

    );
}

export default GroupMember;
