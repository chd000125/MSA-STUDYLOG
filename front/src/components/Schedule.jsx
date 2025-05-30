import React, { useState } from "react";
import '../style/group/Schedule.css';

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
const monthNames = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월"
];

// 여러 개의 이벤트를 배열로 저장
const events = {
  '2025-05-01': ['근로자의 날'],
  '2025-05-04': ['자격증 시험'],
  '2025-05-11': ['토익 시험'],
  '2025-05-20': ['운전면허 시험', '실기 시험'],
  '2025-12-25': ['크리스마스'],
};

const Schedule = ({ onMonthChange, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const isToday = (day) => {
    return (
      day &&
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getDate() === day
    );
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  // 날짜 클릭 시 이벤트와 날짜를 함께 반환
  const handleDateClick = (day) => {
    if (!day) return;

    // 선택된 날짜를 Date 객체로 생성
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    // 선택된 날짜를 YYYY-MM-DD 형식으로 변환
    const selectedDateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // 해당 날짜의 이벤트가 있는지 확인
    const event = events[selectedDateKey] || null;

    // 날짜와 해당 날짜의 이벤트를 반환
    onDateSelect?.({ date: selectedDate, events: event });
  };

  const getEventsForDate = (year, month, day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events[key];
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const days = [];
    let week = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      week.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      week.push(day);
      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      days.push(week);
    }

    return days;
  };

  return (
    <div className="schedule-calendar-container">
      <div className="schedule-calendar-header">
        <button className="schedule-button" onClick={() => handleMonthChange(-1)}>&lt;</button>
        <h2 className="schedule-month">{`${currentDate.getFullYear()}년 ${monthNames[currentDate.getMonth()]}`}</h2>
        <button className="schedule-button" onClick={() => handleMonthChange(1)}>&gt;</button>
      </div>
      <table className="schedule-calendar-table">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {generateCalendar().map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => {
                const eventsForDay = day ? getEventsForDate(currentDate.getFullYear(), currentDate.getMonth(), day) : null;

                return (
                  <td
                    key={j}
                    onClick={() => handleDateClick(day)}
                    className={`schedule-calendar-cell ${isToday(day) ? "schedule-today" : ""}`}
                  >
                    {day && (
                      <>
                        <span className="schedule-day-number">{day}</span>
                        {eventsForDay && (
                          <div className="schedule-events-container">
                            {eventsForDay.map((event, index) => (
                              <div key={index} className="schedule-event">{event}</div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
