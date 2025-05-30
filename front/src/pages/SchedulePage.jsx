import React, { useState } from 'react';
import Schedule from '../components/Schedule';
import '../style/group/SchedulePage.css';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]); // 여러 이벤트를 저장하기 위해 배열로 설정

  // 날짜와 이벤트를 함께 받아오는 함수
  const handleDateSelect = ({ date, events }) => {
    setSelectedDate(date);
    setEvents(events || []); // 선택된 날짜의 이벤트들 (배열로 관리)
  };

  return (
    <div className="schedule-page">
      <h1>일정</h1>
      <Schedule
        onDateSelect={handleDateSelect}
      />
      <div className="selected-date">
        {selectedDate ? (
          <>
            <h2>
              {`${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`}
            </h2>
            {events.length > 0 ? (
              <ul>
                {events.map((event, index) => (
                  <li key={index}>{event}</li> // 여러 이벤트가 있을 경우 리스트로 출력
                ))}
              </ul>
            ) : (
              <p>이 날짜에는 일정이 없습니다.</p>
            )}
          </>
        ) : (
          <h2>선택된 날짜가 없습니다</h2>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;