import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../style/group/EditGroupMember.css';
import {
    updateStudyGroup,
    getStudyGroupById,
    getStudyDetail,
    getCurriculumsByStudy,
    updateStudyDetailAll,
    updateCurriculums
} from '../../api/GroupServiceApi';
import { fetchCategoryList, fetchTags } from '../../api/boardApi';

function EditGroupMember() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [ setTags] = useState([]);
    const [formData, setFormData] = useState(null);
    const days = ['월', '화', '수', '목', '금', '토', '일'];

    const locations = [
        { id: 'seoul', name: '서울' }, { id: 'gyeonggi', name: '경기' },
        { id: 'incheon', name: '인천' }, { id: 'daegu', name: '대구' },
        { id: 'jeju', name: '제주' }, { id: 'busan', name: '부산' },
        { id: 'gwangju', name: '광주' }, { id: 'gangwon', name: '강원' },
        { id: 'ulsan', name: '울산' }, { id: 'chungbook', name: '충북' },
        { id: 'chungnam', name: '충남' }, { id: 'daejeon', name: '대전' },
    ];


    const stored = JSON.parse(localStorage.getItem('userState'));
    const user = typeof stored?.user === 'string' ? JSON.parse(stored.user) : stored?.user;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupRes, detailRes, curriculumRes] = await Promise.all([
                    getStudyGroupById(id),
                    getStudyDetail(id),
                    getCurriculumsByStudy(id, 0, 50)
                ]);

                setFormData({
                    title: groupRes.data.title,
                    category: groupRes.data.category,
                    location: groupRes.data.location,
                    maxMembers: groupRes.data.maxMember,
                    startDate: groupRes.data.startDate,
                    endDate: groupRes.data.endDate,
                    description: groupRes.data.description,
                    meetingType: groupRes.data.meetingType,
                    meetingDay: groupRes.data.meetingDay || [],
                    meetingTime: groupRes.data.meetingTime,
                    tools: detailRes.data.tools || [],
                    curriculum: curriculumRes.data.content || [],
                    tags: [], // Optional: You can fetch existing tags
                    requesterEmail: user?.uEmail,
                });
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            }
        };

        fetchData();
        fetchCategoryList().then(res => {
            const list = res.data.map(c => ({ id: c.category.toLowerCase(), name: c.category }));
            setCategories(list);
        });
        fetchTags().then(res => setTags(res.data)).catch(err => console.error('태그 불러오기 실패:', err));
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMeetingDayChange = (day) => {
        setFormData(prev => {
            const meetingDay = prev.meetingDay.includes(day)
                ? prev.meetingDay.filter(d => d !== day)
                : [...prev.meetingDay, day];
            return { ...prev, meetingDay };
        });
    };

    const handleArrayInputChange = (index, value, field) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    };

    const handleAddArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const handleRemoveArrayItem = (index, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleCurriculumChange = (index, field, value) => {
        setFormData(prev => {
            const newCurriculum = [...prev.curriculum];
            if (field === 'topics') {
                newCurriculum[index] = {
                    ...newCurriculum[index],
                    topics: value.split(',').map(topic => topic.trim())
                };
            } else {
                newCurriculum[index] = {
                    ...newCurriculum[index],
                    [field]: value
                };
            }
            return { ...prev, curriculum: newCurriculum };
        });
    };

    const handleAddCurriculumWeek = () => {
        setFormData(prev => ({
            ...prev,
            curriculum: [...prev.curriculum, { week: prev.curriculum.length + 1, title: '', topics: [''] }]
        }));
    };

    const handleRemoveCurriculumWeek = (index) => {
        setFormData(prev => ({
            ...prev,
            curriculum: prev.curriculum.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            console.log('🧪 보낼 커리큘럼:', formData.curriculum);  // ✅ 여기!
            console.log('📮 요청자 이메일:', formData.requesterEmail);

            await updateStudyGroup(id, {
                title: formData.title,
                description: formData.description,
                maxMember: formData.maxMembers
            }, user?.uEmail);

            await updateStudyDetailAll(id, formData);
            await updateCurriculums(id, formData.curriculum, formData.requesterEmail);
            alert('스터디 정보가 수정되었습니다.');
            navigate(`/group/${id}`);
        } catch (error) {
            console.error('수정 실패:', error);
            alert('수정에 실패했습니다.');
        }
    };

    if (!formData) return <div>로딩 중...</div>;

    return (
        <form onSubmit={handleSubmit} className="edit-container">
            <div className="edit-left-column">
                <div className="edit-card">
                    <h2>스터디 제목</h2>
                    <div className="edit-field">
                        <label>제목</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>
                    <div className="edit-field">
                        <label>카테고리</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} required>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="edit-field">
                        <label>지역</label>
                        <select name="location" value={formData.location} onChange={handleInputChange} required>
                            {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                        </select>
                    </div>
                </div>


                <div className="edit-card">
                    <h2>스터디 설명</h2>
                    <div className="edit-field">
                        <label>설명</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                    </div>
                </div>


                <div className="edit-card">
                    <h2>모임 정보</h2>
                    <div className="edit-day-selector">
                        {days.map(day => (
                            <button type="button" key={day}
                                    className={`edit-day-button ${formData.meetingDay.includes(day) ? 'selected' : ''}`}
                                    onClick={() => handleMeetingDayChange(day)}>
                                {day}
                            </button>
                        ))}
                    </div>
                    <div className="edit-field">
                        <label>시작일</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                    </div>
                    <div className="edit-field">
                        <label>종료일</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                    </div>
                    <div className="edit-field">
                        <label>모임 방식</label>
                        <select name="meetingType" value={formData.meetingType} onChange={handleInputChange}>
                            <option value="online">온라인</option>
                            <option value="offline">오프라인</option>
                        </select>
                    </div>

                    <div className="edit-field">
                        <label>모임 시간</label>
                        <input type="time" name="meetingTime" value={formData.meetingTime} onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            <div className="edit-right-column">
                <div className="edit-card">
                    <h2>사용 도구</h2>
                    {formData.tools.map((tool, index) => (
                        <div key={index} className="edit-input-container">
                            <input type="text" value={tool} onChange={(e) => handleArrayInputChange(index, e.target.value, 'tools')} />
                            <button type="button" onClick={() => handleRemoveArrayItem(index, 'tools')} className="edit-btn-remove">−</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddArrayItem('tools')} className="edit-btn-add">+</button>
                </div>



                <div className="edit-card">
                    <h2>커리큘럼</h2>
                    {formData.curriculum.map((week, index) => (
                        <div key={index} className="edit-curriculum-box">

                            <div className="edit-field">
                            <label>{week.week}주차 제목</label>
                            <input type="text" value={week.title} onChange={(e) => handleCurriculumChange(index, 'title', e.target.value)} />
                            </div>


                            <div className="edit-field">
                            <label>주제 (쉼표로 구분)</label>
                            <input type="text" value={week.topics.join(', ')} onChange={(e) => handleCurriculumChange(index, 'topics', e.target.value)} />
                            </div>


                            <button type="button" onClick={() => handleRemoveCurriculumWeek(index)} className="edit-btn-remove">−</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddCurriculumWeek} className="edit-btn-add">+</button>
                </div>

                <div className="edit-form-buttons">
                    <button type="submit">수정 완료</button>
                    <button type="button" onClick={() => navigate(`/group/${id}`)}>취소</button>
                </div>
            </div>
        </form>

    );
}

export default EditGroupMember;
