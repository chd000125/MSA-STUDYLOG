import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/board/PostCreate.css';
import {
    fetchCategoryList,
    fetchTags,
    createPost,
} from '../../api/boardApi';
import { getManagedGroups } from '../../api/GroupServiceApi.js';
import { Editor } from '@tinymce/tinymce-react';

const PostCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [boardId, setBoardId] = useState('');
    const [boards, setBoards] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [attachedStudyId, setAttachedStudyId] = useState(null);

    const editorRef = useRef(null);
    const navigate = useNavigate();
    const stored = JSON.parse(localStorage.getItem('userState'));
    const user = stored?.user;

    useEffect(() => {
        if (user?.uName) setAuthor(user.uName);

        fetchCategoryList()
            .then(res => setBoards(res.data))
            .catch(err => console.error('보드 목록 실패:', err));

        fetchTags()
            .then(res => setTags(res.data))
            .catch(err => console.error('태그 목록 실패:', err));

        if (user?.uEmail) {
            getManagedGroups(user.uEmail)
                .then(res => {
                    setUserGroups(res.data.content || []);
                })
                .catch(err => console.error('스터디 조회 실패:', err));
        }
    }, []);

    const handleTagChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedTags((prev) => [...prev, value]);
        } else {
            setSelectedTags((prev) => prev.filter((tag) => tag !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!boardId) {
            alert('카테고리를 선택해주세요!');
            return;
        }

        const newPost = {
            title,
            content,
            authorEmail: user.uEmail,
            authorName: author || user.uName,
            tagNames: selectedTags,
            studyGroupId: attachedStudyId,
        };

        createPost(boardId, newPost)
            .then((res) => {
                alert('포스트가 생성되었습니다!');
                setTitle('');
                setContent('');
                setBoardId('');
                setSelectedTags([]);
                navigate('/board');
            })
            .catch((err) => {
                console.error('포스트 저장 실패:', err);
                alert('포스트 저장에 실패했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <div className="post-create-container">
            <div className="post-create-header">
                <h2>게시글 생성</h2>
                <div className="author-display">작성자: {author}</div>
            </div>

            <form onSubmit={handleSubmit} className="post-create-form">
                <div>
                    <label htmlFor="title">제목:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content">내용:</label>
                    <Editor
                        id="content"
                        apiKey="68z7f8dvt94vjo1dvu2wxgtbgve4lyc75gauf1na3h7d05xd"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        value={content}
                        onEditorChange={(newContent) => setContent(newContent)}
                        init={{
                            height: 400,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table code help wordcount',
                            ],
                            toolbar:
                                'undo redo | formatselect | bold italic underline forecolor backcolor | ' +
                                'alignleft aligncenter alignright alignjustify | ' +
                                'bullist numlist outdent indent | removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="board">카테고리 선택:</label>
                    <select
                        id="board"
                        value={boardId}
                        onChange={(e) => setBoardId(e.target.value)}
                        required
                    >
                        <option value="">-- 카테고리 선택 --</option>
                        {boards.map((board) => (
                            <option key={board.bId} value={board.bId}>
                                {board.category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="tag-select-container">
                    <label>태그 선택:</label>
                    <div className="tag-list">
                        {tags.map((tag) => (
                            <div key={tag.id}>
                                <input
                                    type="checkbox"
                                    id={`tag-${tag.id}`}
                                    className="tag-checkbox"
                                    value={tag.name}
                                    checked={selectedTags.includes(tag.name)}
                                    onChange={handleTagChange}
                                />
                                <label htmlFor={`tag-${tag.id}`} className="tag-label">
                                    {tag.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit">포스트 생성</button>
            </form>
        </div>
    );
};

export default PostCreate;
