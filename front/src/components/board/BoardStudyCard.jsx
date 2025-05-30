import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getManagedGroups, getJoinedGroups } from '../../api/GroupServiceApi';
// import '../../style/group/BoardStudyCard.css';

const BoardStudyCard = ({ useremail }) => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!useremail)  {
            console.warn('❌ useremail 없음 - BoardStudyCard 실행 안 함');
            return;
        }
        console.log('📡 BoardStudyCard 요청됨, 이메일:', useremail);

        const fetchGroups = async () => {
            try {
                setLoading(true);

                const [managedRes, joinedRes] = await Promise.all([
                    getManagedGroups(useremail, 0, 5),
                    getJoinedGroups(useremail, 0, 5)
                ]);

                console.log('📥 managed:', managedRes.data.content);
                console.log('📥 joined:', joinedRes.data.content);

                const combined = [...managedRes.data.content, ...joinedRes.data.content];

                // 중복 제거 (같은 그룹이 관리 + 참여 둘 다인 경우)
                const uniqueGroups = Array.from(new Map(combined.map(g => [g.id, g])).values());

                setGroups(uniqueGroups);
            } catch (err) {
                console.error('스터디 정보 로딩 실패:', err);
                setError('스터디 정보를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [useremail]);

    if (!useremail) return null;

    return (
        <div className="board-study-card-wrapper">
            <h4>작성자의 스터디 그룹</h4>

            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : groups.length === 0 ? (
                <p>참여 중인 스터디가 없습니다.</p>
            ) : (
                groups.map(group => (
                    <div
                        key={group.id}
                        className="board-study-card"
                        onClick={() => navigate(`/study/${group.id}`)}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px',
                            marginBottom: '10px',
                            cursor: 'pointer',
                            backgroundColor: '#fdfdfd'
                        }}
                    >
                        <h5>{group.title}</h5>
                        <p>상태: {group.status}</p>
                        <p>인원: {group.currentMember} / {group.maxMember}</p>
                        <p>시작일: {group.startDate}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default BoardStudyCard;
