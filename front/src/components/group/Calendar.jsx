import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../style/group/CustomCalander.css';

const CustomCalendar = ({ onDateChange, todos }) => {
    const [value, setValue] = useState(new Date());

    const handleChange = (date) => {
        setValue(date);
        onDateChange(date);
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleChange}
                value={value}
                calendarType="gregory"  // ★ 추가! (일요일을 왼쪽으로)
                formatDay={(locale, date) => date.getDate()}  // ★ 숫자만 출력
                tileContent={({ date, view }) => {
                    if (view === 'month' && todos) {
                        const todayTodos = todos.filter(todo =>
                            new Date(todo.createdDate).toDateString() === date.toDateString()
                        );

                        const maxItems = 2;
                        const visibleTodos = todayTodos.slice(0, maxItems);
                        const moreCount = todayTodos.length - maxItems;

                        return (
                            <div className="tile-content">
                                {visibleTodos.map((todo, index) => (
                                    <div key={index} className="todo-label">
                                        {todo.title}
                                    </div>
                                ))}
                                {moreCount > 0 && (
                                    <div className="more-label">
                                        +{moreCount}개 더
                                    </div>
                                )}
                            </div>
                        );
                    }
                }}
            />
        </div>
    );
};

export default CustomCalendar;