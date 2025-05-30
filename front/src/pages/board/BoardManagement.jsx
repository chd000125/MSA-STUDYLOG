import React, { useEffect, useState } from 'react';
import {
    fetchCategoryList,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
} from '../../api/boardApi'; // ✅ axios 대신 API 모듈
// axios import 제거
import '../../style/board/BoardManagement.css';


function BoardManagement() {
    const [boards, setBoards] = useState([]);
    const [tags, setTags] = useState([]);
    const [editingBoard, setEditingBoard] = useState(null);
    const [boardName, setBoardName] = useState('');
    const [newBoardName, setNewBoardName] = useState('');

    const [newTagName, setNewTagName] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [tagName, setTagName] = useState('');

    useEffect(() => {
        fetchCategoryList()
            .then((res) => setBoards(res.data))
            .catch((err) => console.error('보드 목록 불러오기 실패:', err));

        fetchTags()
            .then((res) => setTags(res.data))
            .catch((err) => console.error('태그 목록 불러오기 실패:', err));
    }, []);

    const handleEditBoard = (board) => {
        setEditingBoard(board);
        setBoardName(board.category);
    };

    const handleSaveBoard = (boardId) => {
        if (!boardName.trim()) {
            alert('보드 이름을 입력하세요.');
            return;
        }

        updateCategory(boardId, boardName)
            .then((res) => {
                const updatedCategory = res.data.category || boardName;
                setBoards((prev) =>
                    prev.map((b) =>
                        b.bId === boardId ? { ...b, category: updatedCategory } : b
                    )
                );
                setEditingBoard(null);
                setBoardName('');
            })
            .catch((err) => console.error('보드 수정 실패:', err));
    };

    const handleDeleteBoard = (boardId) => {
        if (window.confirm('정말로 이 보드를 삭제하시겠습니까?')) {
            deleteCategory(boardId)
                .then(() => {
                    setBoards((prev) => prev.filter((b) => b.bId !== boardId));
                })
                .catch((err) => console.error('보드 삭제 실패:', err));
        }
    };

    const handleAddBoard = () => {
        if (!newBoardName.trim()) {
            alert('보드 이름을 입력하세요.');
            return;
        }

        createCategory(newBoardName)
            .then((res) => {
                setBoards((prev) => [...prev, res.data]);
                setNewBoardName('');
            })
            .catch((err) => console.error('보드 추가 실패:', err));
    };

    const handleAddTag = () => {
        if (!newTagName.trim()) {
            alert('태그 이름을 입력하세요.');
            return;
        }

        createTag(newTagName)
            .then((res) => {
                setTags((prev) => [...prev, res.data]);
                setNewTagName('');
            })
            .catch((err) => console.error('태그 추가 실패:', err));
    };

    const handleEditTag = (tag) => {
        setEditingTag(tag);
        setTagName(tag.name);
    };

    const handleSaveTag = (tagId) => {
        if (!tagName.trim()) {
            alert('태그 이름을 입력하세요.');
            return;
        }

        updateTag(tagId, tagName)
            .then((res) => {
                setTags((prev) =>
                    prev.map((tag) =>
                        tag.id === tagId ? { ...tag, name: res.data.name } : tag
                    )
                );
                setEditingTag(null);
                setTagName('');
            })
            .catch((err) => console.error('태그 수정 실패:', err));
    };

    const handleDeleteTag = (tagId) => {
        if (window.confirm('정말로 이 태그를 삭제하시겠습니까?')) {
            deleteTag(tagId)
                .then(() => {
                    setTags((prev) => prev.filter((tag) => tag.id !== tagId));
                })
                .catch((err) => console.error('태그 삭제 실패:', err));
        }
    };

    return (
        <div className="board-management-container">
            <h2>카테고리 관리</h2>

            <div>
                <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="새로운 카테고리 이름"
                />
                <button onClick={handleAddBoard}>카테고리 추가</button>
            </div>

            <ul className="board-list">
                {boards.map((board) => (
                    <li key={board.bId}>
                        {editingBoard?.bId === board.bId ? (
                            <>
                                <input
                                    type="text"
                                    value={boardName}
                                    onChange={(e) => setBoardName(e.target.value)}
                                    placeholder="보드 이름"
                                />
                                <div>
                                    <button onClick={() => handleSaveBoard(board.bId)}>저장</button>
                                    <button onClick={() => setEditingBoard(null)}>취소</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span>{board.category}</span>
                                <button onClick={() => handleEditBoard(board)}>수정</button>
                                <button onClick={() => handleDeleteBoard(board.bId)}>삭제</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <h2>태그 관리</h2>
            <div>
                <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="새로운 태그 이름"
                />
                <button onClick={handleAddTag}>태그 추가</button>
            </div>

            <ul className="tag-list">
                {tags.map((tag) => (
                    <li key={tag.id}>
                        {editingTag?.id === tag.id ? (
                            <>
                                <input
                                    type="text"
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
                                    placeholder="태그 이름"
                                />
                                <div>
                                    <button onClick={() => handleSaveTag(tag.id)}>저장</button>
                                    <button onClick={() => setEditingTag(null)}>취소</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span>{tag.name}</span>
                                <button onClick={() => handleEditTag(tag)}>수정</button>
                                <button onClick={() => handleDeleteTag(tag.id)}>삭제</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BoardManagement;
