import React, { useState, useEffect } from 'react';
import '../../style/group/StudySearch.css';
import { useNavigate } from 'react-router-dom';
import { getAllAdminStudyGroupsPaged, adminDeleteStudyGroup } from '../../api/GroupServiceApi';

function AdminStudyPage() {
    const navigate = useNavigate();
    const [studies, setStudies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudies = async () => {
            setIsLoading(true);
            try {
                console.log('📡 관리자 스터디 데이터 요청 시작');
                const response = await getAllAdminStudyGroupsPaged(0, 100);
                console.log('✅ 관리자 스터디 데이터 응답:', response.data);

                setStudies(response.data.content);
            } catch (error) {
                console.error('❌ 관리자 스터디 데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudies();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await adminDeleteStudyGroup(id);
            setStudies(prev => prev.filter(study => study.id !== id));
            alert('삭제되었습니다.');
        } catch (error) {
            console.error('❌ 삭제 실패:', error);
            alert('삭제 실패');
        }
    };

    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    return (
        <div className="study-search">
            <h2>관리자 스터디 관리 페이지</h2>

            <div className="study-list">
                {studies.length === 0 ? (
                    <div className="no-results">스터디가 없습니다.</div>
                ) : (
                    studies.map(study => (
                        <div key={study.id} className="study-card admin">
                            <div className="study-card-header">
                                <h3>{study.title}</h3>
                                <span>스터디장: {study.uname || '알 수 없음'}</span>
                            </div>

                            <div className="admin-actions">
                                <button onClick={() => handleDelete(study.id)} className="delete-btn">삭제</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminStudyPage;
