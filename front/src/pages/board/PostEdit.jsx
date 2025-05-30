import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/board/PostEdit.css';
import {
    fetchPostById,
    updatePost,
    deletePost,
    fetchCategoryList,
    fetchTags,
} from '../../api/boardApi';
import { Editor } from '@tinymce/tinymce-react';

function PostEdit() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);

    const [post, setPost] = useState(null);
    const [boards, setBoards] = useState([]);
    const [tags, setTags] = useState([]);
    const [boardId, setBoardId] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const stored = JSON.parse(localStorage.getItem('userState'));
    const user = stored?.user;

    useEffect(() => {
        fetchPostById(postId)
            .then((response) => {
                const data = response.data;
                setPost({
                    title: data.title,
                    content: data.content,
                    authorName: data.authorName,
                });
                setBoardId(data.boardId);
                setSelectedTags(data.tags.map(tag => tag.name));
            })
            .catch((error) => {
                console.error('게시글 불러오기 실패:', error);
            });

        fetchCategoryList()
            .then(res => setBoards(res.data))
            .catch(err => console.error('카테고리 목록 오류:', err));

        fetchTags()
            .then(res => setTags(res.data))
            .catch(err => console.error('태그 목록 오류:', err));
    }, [postId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedTags(prev => [...prev, value]);
        } else {
            setSelectedTags(prev => prev.filter(tag => tag !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedPost = {
            ...post,
            authorEmail: user?.uEmail,
            authorName: user?.uName || post.authorName,
            boardId,
            tagNames: selectedTags,
        };

        updatePost(postId, updatedPost)
            .then(() => {
                alert('수정이 완료되었습니다.');
                navigate(`/posts/${postId}`);
            })
            .catch((error) => {
                console.error('수정 실패:', error);
                alert('수정 중 오류가 발생했습니다.');
            });
    };

    const handleDelete = () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            deletePost(postId)
                .then(() => {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/board');
                })
                .catch((error) => {
                    console.error('삭제 실패:', error);
                    alert('삭제 중 오류가 발생했습니다.');
                });
        }
    };

    if (!post) return <div>로딩 중...</div>;

    return (
        <div className="post-edit-page">
            <div className="edit-post-container">
                <div className="edit-post-author">작성자: <strong>{post.authorName}</strong></div>
                <h2>게시글 수정</h2>
                <form onSubmit={handleSubmit} className="edit-post-form">
                    <div>
                        <label htmlFor="title">제목:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={post.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="content">내용:</label>
                        <Editor
                            id="content"
                            apiKey="68z7f8dvt94vjo1dvu2wxgtbgve4lyc75gauf1na3h7d05xd"
                            onInit={(evt, editor) => (editorRef.current = editor)}
                            value={post.content}
                            onEditorChange={(newContent) => setPost(prev => ({ ...prev, content: newContent }))}
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
                            {boards.map(board => (
                                <option key={board.bId} value={board.bId}>{board.category}</option>
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
                                    <label htmlFor={`tag-${tag.id}`} className="tag-label" >{tag.name} </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="edit-post-submit-button">수정 완료</button>
                </form>

                <button onClick={handleDelete} className="edit-post-delete-button">삭제하기</button>
            </div>
        </div>
    );
}

export default PostEdit;
