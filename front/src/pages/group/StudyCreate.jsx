import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/group/StudyCreate.css';
import { createStudyGroup } from "../../api/GroupServiceApi.js";
import { fetchCategoryList, fetchTags } from "../../api/boardApi.js"; // ✅ 추가
import * as study from "framer-motion/m";

function StudyCreate() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]); // ✅ 추가
    const [tags, setTags] = useState([]);
    const [formData, setFormData] = useState({
        uEmail: '',
        uName: '',
        title: '',
        category: '',
        location: 'online',
        maxMembers: 5,
        startDate: '',
        endDate: '',
        description: '',
        meetingType: 'online',
        meetingDay: [],
        meetingTime: '',
        requirements: [''],
        curriculum: [{ week: 1, title: '', topics: [''] }],
        tools: [''],
        benefits: [''],
        tags: []
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

    const days = ['월', '화', '수', '목', '금', '토', '일'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            let updatedTags = checked
                ? [...prev.tags, value]
                : prev.tags.filter(tag => tag !== value);
            return { ...prev, tags: updatedTags };
        });
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
            curriculum: [...prev.curriculum, {
                week: prev.curriculum.length + 1,
                title: '',
                topics: ['']
            }]
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
        console.log("📦 보내는 요청:", formData);
        try {
            const response = await createStudyGroup(formData);
            alert("스터디가 생성되었습니다.");
            console.log("✅ 생성된 스터디:", response.data);
            navigate("/study/search");
        } catch (error) {
            console.error("❌ 스터디 생성 실패:", error);
            alert("스터디 생성에 실패했습니다.");
        }
    };

    useEffect(() => {
        const userState = JSON.parse(localStorage.getItem('userState'));
        if (userState?.user?.uEmail && userState?.user?.uName) {
            setFormData(prev => ({
                ...prev,
                uName: userState.user.uName,
                uEmail: userState.user.uEmail
            }));
        }

        // ✅ 카테고리 불러오기
        const fetchCategories = async () => {
            try {
                const res = await fetchCategoryList();
                const list = res.data.map(c => ({
                    id: c.category.toLowerCase(),
                    name: c.category
                }));
                setCategories(list);
                if (list.length > 0) {
                    setFormData(prev => ({ ...prev, category: list[0].id }));
                }
            } catch (err) {
                console.error("❌ 카테고리 불러오기 실패:", err);
            }
        };

        fetchCategories();

        fetchTags()
            .then((res) => setTags(res.data))
            .catch((err) => console.error('태그 목록 불러오기 실패:', err));
    }, []);
    return (
        <form onSubmit={handleSubmit}>
            <div className="study-create-container">
                {/* 왼쪽 메인 영역 */}
                <div className="study-left-column">
                    {/* 기본 정보 */}
                    <div className="study-create-card">
                        <h2>기본 정보</h2>
                        <div className="study-field">
                            <label>스터디 제목</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                        </div>
                        {/* ✅ 수정된 카테고리 select */}
                        <div className="study-field">
                            <label>카테고리</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} required>
                                {categories.length > 0 ? (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                ) : (
                                    <option>카테고리 불러오는 중...</option>
                                )}
                            </select>
                        </div>
                        <div className="study-field">
                            <label>태그</label>
                            <div className="tag-select-container">
                                <div className="tag-list">
                                    {tags.length > 0 ? (
                                        tags.map((tag) => (
                                            <div key={tag.id}>
                                                <input
                                                    type="checkbox"
                                                    id={`tag-${tag.id}`}
                                                    className="tag-checkbox"
                                                    value={tag.name}
                                                    checked={formData.tags.includes(tag.name)}
                                                    onChange={handleTagChange}
                                                />
                                                <label htmlFor={`tag-${tag.id}`} className="tag-label">
                                                    {tag.name}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p>태그를 불러오는 중...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div className="study-field" style={{ flex: 1 }}>
                                <label>지역</label>
                                <select name="location" value={formData.location} onChange={handleInputChange} required>
                                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                </select>
                            </div>
                            <div className="study-field" style={{ flex: 1 }}>
                                <label>최대 인원</label>
                                <input type="number" name="maxMembers" value={formData.maxMembers} onChange={handleInputChange} min="2" max="20" required />
                            </div>
                        </div>
                    </div>

                    {/* 스터디 설명 */}
                    <div className="study-create-card">
                        <h2>스터디 설명</h2>
                        <div className="study-field">

                            <label>설명</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="study-description-textarea"
                                required
                            />
                            <span className="info-coments">
                                <div className="info-icon">⚠︎</div>
                                다른 유저들에게 스터디에 대해 설명해주세요! 설정한 내용은 스터디를 만든 후 변경이 가능합니다.
                            </span>
                        </div>
                    </div>

                    {/* 모임 정보 */}
                    <div className="study-create-card">
                        <h2>모임 정보</h2>
                        <div className="study-field">
                            <label>모임 요일</label>
                            <div className="study-day-selector">
                                {days.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`study-day-button ${formData.meetingDay.includes(day) ? 'selected' : ''}`}
                                        onClick={() => handleMeetingDayChange(day)}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div className="study-field" style={{ flex: 1 }}>
                                <label>시작일</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                            </div>
                            <div className="study-field" style={{ flex: 1 }}>
                                <label>종료일</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div className="study-field" style={{ flex: 1 }}>
                                <label>모임 방식</label>
                                <select name="meetingType" value={formData.meetingType} onChange={handleInputChange} required>
                                    <option value="online">온라인</option>
                                    <option value="offline">오프라인</option>
                                </select>
                            </div>
                            <div className="study-field" style={{ flex: 1 }}>
                                <label>모임 시간</label>
                                <input type="time" name="meetingTime" value={formData.meetingTime} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽 보조 영역 */}
                <div className="study-right-column">
                    {/* 버튼 영역 */}
                    <div className="form-buttons">
                        <button type="submit">스터디 만들기</button>
                        <button type="button" onClick={() => navigate('/study/search')}>취소</button>
                    </div>
                    {/* 참여 조건 */}
                    <div className="study-create-card">
                        <h2>참여 조건</h2>
                        {formData.requirements.map((req, index) => (
                            <div key={index} className="study-input-container">
                                <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'requirements')}
                                    placeholder="참여 조건"
                                    required
                                />
                                <button type="button" onClick={() => handleRemoveArrayItem(index, 'requirements')} className="study-btn-remove">−</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddArrayItem('requirements')} className="study-btn-add">+</button>
                    </div>

                    {/* 사용 도구 */}
                    <div className="study-create-card">
                        <h2>사용 도구</h2>
                        {formData.tools.map((tool, index) => (
                            <div key={index} className="study-input-container">
                                <input
                                    type="text"
                                    value={tool}
                                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'tools')}
                                    placeholder="도구 이름"
                                    required
                                />
                                <button type="button" onClick={() => handleRemoveArrayItem(index, 'tools')} className="study-btn-remove">−</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddArrayItem('tools')} className="study-btn-add">+</button>
                    </div>

                    {/* 커리큘럼 */}
                    <div className="study-create-card">
                        <h2>커리큘럼</h2>
                        {formData.curriculum.map((week, index) => (
                            <div key={index} className="study-curriculum-box">
                                <div className="study-field">
                                    <label>{week.week}주차 제목</label>
                                    <input
                                        type="text"
                                        value={week.title}
                                        onChange={(e) => handleCurriculumChange(index, 'title', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="study-field">
                                    <label>주제 (쉼표 구분)</label>
                                    <input
                                        type="text"
                                        value={week.topics.join(', ')}
                                        onChange={(e) => handleCurriculumChange(index, 'topics', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="curriculum-remove-container">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCurriculumWeek(index)}
                                        className="study-btn-remove"
                                    >
                                        −
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddCurriculumWeek} className="study-btn-add">+</button>
                    </div>
                </div>

            </div>


        </form>
    );

}

export default StudyCreate;