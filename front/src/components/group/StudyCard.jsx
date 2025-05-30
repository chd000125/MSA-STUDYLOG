import React from 'react';
import "../../style/group/StudyCard.css"
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getAllStudyGroupsPaged} from "../../api/GroupServiceApi.js";


function StudyCard({ study, onClick }) {

    const navigate = useNavigate();
    const [studies, setStudies] = useState([]);


    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const response = await getAllStudyGroupsPaged(0, 10); // 최신 10개만 불러옴
                setStudies(response.data.content);
            } catch (err) {
                console.error("🔥 스터디 목록 불러오기 실패", err);
            }
        };

        fetchStudies();
    }, []);

    if (studies.length === 0) {
        return <div className="no-results">검색 결과가 없습니다.</div>;
    }


    return (
        <div
            className={`study-card-container ${study.currentMember >= study.maxMember ? 'closed' : ''}`}
            onClick={() => {
                if (study.currentMember < study.maxMember) {
                    onClick(); // 마감이면 클릭 안 되게 처리
                }
            }}
        >
            {/*<div className="study-card-image">*/}
            {/*    <img*/}
            {/*        src={study.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"}*/}
            {/*        alt="study"*/}
            {/*    />*/}
            {/*</div>*/}
            <div className="study-card-body">
                <div className="study-tag">
                    {study.currentMember >= study.maxMember ? "마감" : "모집중"}
                </div>
                <h6 className="study-title">{study.title}</h6>
                <p className="study-description">
                    {study.description?.slice(0, 100) || '설명이 없습니다.'}
                </p>
            </div>
            <div className="study-card-footer">
                <div className="study-author">
                    <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d"
                        alt="author"
                        className="author-avatar"
                    />
                    <div className="author-info">
                        <span className="author-name">{study.uname || '알 수 없음'}</span>
                        <span className="author-date">{study.startDate || '시작일 미정'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudyCard;