// src/components/TodoList.jsx
import React, { useEffect, useState } from 'react';
import {createTodo, deleteTodo, getAllTodos, updateTodo} from '../../api/GroupServiceApi.js'; // API 연동용 (준비했으면)
import "../../style/group/TodoList.css"



const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await getAllTodos();
            setTodos(response.data);
        } catch (error) {
            console.error("할 일 가져오기 실패:", error);
        }
    };

    const handleCreate = async () => {
        if (newTodo.trim() === '') return;
        try {
            await createTodo({ author: "작성자", title: newTodo, completed: false });
            setNewTodo('');
            fetchTodos(); // 새로고침
        } catch (error) {
            console.error("할 일 생성 실패:", error);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const targetTodo = todos.find(todo => todo.id === id);
            if (!targetTodo) return;
            const updatedTitle = prompt("새 제목을 입력하세요:", targetTodo.title);
            if (updatedTitle !== null) {
                await updateTodo(id, { author: targetTodo.author, title: updatedTitle, completed: targetTodo.completed });
                fetchTodos();
            }
        } catch (error) {
            console.error("할 일 수정 실패:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            fetchTodos();
        } catch (error) {
            console.error("할 일 삭제 실패:", error);
        }
    };

    return (
        <div className="todo-container">
            <h2>오늘의 할 일</h2>

            <div className="create-form">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="할 일을 입력하세요"
                />
                <button className="neumorphism-button" onClick={handleCreate}>추가</button>
            </div>

            <div className="todo-list">
                {todos.map(todo => (
                    <div key={todo.id} className="todo-item neumorphism-box">
                        <div className="field">{new Date(todo.createdDate).toLocaleString()}</div>
                        <div className="field">{todo.title}</div>
                        <div className="field">{todo.progress}%</div>
                        <div className="field">{todo.completed ? "✅ 완료" : "⏳ 진행 중"}</div>
                        <div className="field">{todo.author}</div>
                        <div className="action-buttons">
                            <button className="neumorphism-button" onClick={() => handleUpdate(todo.id)}>수정</button>
                            <button className="neumorphism-button" onClick={() => handleDelete(todo.id)}>삭제</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;