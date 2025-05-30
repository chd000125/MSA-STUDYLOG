import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/group/StudyGroupSection.css'
import {
    getManagedGroups,
    getJoinedGroups,
    getApplicantsByStudy,
    acceptMember, rejectMember
} from '../../api/GroupServiceApi';

const StudyGroupSection = () => {
    const [managedGroups, setManagedGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [applicantsMap, setApplicantsMap] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const userState = JSON.parse(localStorage.getItem('userState'));
            const user = userState?.user;
            const email = user?.uEmail;

            if (!email) {
                setError('이메일 정보를 찾을 수 없습니다.');
                return;
            }

            const [managedRes, joinedRes] = await Promise.all([
                getManagedGroups(email, 0, 10),
                getJoinedGroups(email, 0, 10)
            ]);

            setManagedGroups(managedRes.data.content);
            setJoinedGroups(joinedRes.data.content);

            const applicantPromises = managedRes.data.content.map(group =>
                getApplicantsByStudy(group.id, 0, 10).then(res => ({
                    groupId: group.id,
                    applicants: res.data.content
                }))
            );

            const applicantResults = await Promise.all(applicantPromises);
            const map = {};
            applicantResults.forEach(({ groupId, applicants }) => {
                map[groupId] = applicants;
            });

            setApplicantsMap(map);
        } catch (err) {
            console.error('스터디 그룹 조회 실패:', err);
            setError('스터디 그룹 정보를 불러오지 못했습니다.');
        }
    };

    const handleAccept = async (memberId) => {
        try {
            const userState = JSON.parse(localStorage.getItem("userState"));
            const email = userState?.user?.uEmail;

            if (!email) {
                alert("로그인 정보가 없습니다.");
                return;
            }

            await acceptMember(memberId, email);
            alert("수락 완료");
            fetchGroups();
        } catch (err) {
            console.error("수락 실패:", err);
            alert("수락에 실패했습니다.");
        }
    };

    const handleReject = async (memberId) => {
        try {
            const userState = JSON.parse(localStorage.getItem("userState"));
            const email = userState?.user?.uEmail;

            if (!email) {
                alert("로그인 정보가 없습니다.");
                return;
            }

            await rejectMember(memberId, email);
            alert("거절 완료");
            fetchGroups(); // 목록 갱신
        } catch (err) {
            console.error("거절 실패:", err);
            alert("거절에 실패했습니다.");
        }
    };


    return (
        <div className="study-groups-section">
            <h3>내가 관리하는 스터디 그룹</h3>
            <div className="group-list">
                {managedGroups.length === 0 ? (
                    <p>관리 중인 스터디가 없습니다.</p>
                ) : (
                    managedGroups.map(group => (
                        <div
                            className="mypage-group-card"
                            key={group.id}
                            onClick={() => navigate(`/group/${group.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>{group.title}</h4>
                            <p>상태: {group.status}</p>
                            <p>인원: {group.currentMember} / {group.maxMember}</p>
                            <p>시작일: {group.startDate}</p>

                            <div onClick={e => e.stopPropagation()}>
                                <strong>신청자 목록</strong>
                                <div className="applicants">
                                    {applicantsMap[group.id]?.length > 0 ? (
                                        applicantsMap[group.id].map(applicant => (
                                            <div key={applicant.id} className="applicant-row">
                                                <span>{applicant.userName || applicant.userId}</span>
                                                <div className="btn-group">
                                                    <button
                                                        className="accept-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAccept(applicant.id);
                                                        }}
                                                    >
                                                        수락
                                                    </button>
                                                    <button
                                                        className="reject-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleReject(applicant.id);
                                                        }}
                                                    >
                                                        거절
                                                    </button>
                                                </div>
                                            </div>

                                        ))
                                    ) : (
                                        <p>신청자가 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <h3>내가 소속된 스터디 그룹</h3>
            <div className="group-list">
                {joinedGroups.length === 0 ? (
                    <p>소속된 스터디가 없습니다.</p>
                ) : (
                    joinedGroups.map(group => (
                        <div
                            className="group-card"
                            key={group.id}
                            onClick={() => navigate(`/group/${group.id}`)} // ✅ 참여자는 여기로
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>{group.title}</h4>
                            <p>상태: {group.status}</p>
                            <p>인원: {group.currentMember} / {group.maxMember}</p>
                            <p>시작일: {group.startDate}</p>
                        </div>
                    ))
                )}
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default StudyGroupSection;
