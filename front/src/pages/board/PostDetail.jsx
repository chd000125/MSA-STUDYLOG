import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../../style/board/PostDetail.css';
import BoardStudyCard from '../../components/board/BoardStudyCard';
import {
  fetchPostAndIncreaseView,
  fetchCommentsByPostId,
  createComment,
} from '../../api/boardApi';
import { getStudyGroupById } from '../../api/GroupServiceApi';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page") || 0;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [attachedStudy, setAttachedStudy] = useState(null);

  const stored = JSON.parse(localStorage.getItem('userState'));
  const user = stored?.user;

  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInSeconds / 3600);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${diffInDays}일 전`;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'admin') setIsAdmin(true);

        const postRes = await fetchPostAndIncreaseView(id);
        console.log('✅ 불러온 게시글:', postRes.data); // 여기에 authorEmail 있는지 확인
        const commentRes = await fetchCommentsByPostId(id);

        if (isMounted) {
          setPost(postRes.data);
          setComments(commentRes.data);
        }

        if (postRes.data.studyGroupId) {
          const studyRes = await getStudyGroupById(postRes.data.studyGroupId);
          if (isMounted) setAttachedStudy(studyRes.data);
        }

      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
      }
    };

    if (id) fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleInputChange = (e) => {
    setNewComment({ content: e.target.value });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (!user || !user.uEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    const commentData = {
      authorEmail: user.uEmail,
      authorName: user.uName,
      content: newComment.content,
    };

    try {
      await createComment(id, commentData);
      setNewComment({ content: '' });
      const res = await fetchCommentsByPostId(id);
      setComments(res.data);
    } catch (error) {
      console.error('댓글 등록 오류:', error);
    }
  };

  const handleEditClick = () => {
    navigate(`/post/edit/${id}`);
  };

  const handleBackClick = () => {
    navigate(`/board?page=${page}`);
  };

  if (!post) {
    return <div className="post-detail-container">게시글을 불러오는 중입니다...</div>;
  }

  return (
      <div className="post-detail-layout">
        <div className="post-detail-main">
          <div className="post-detail-container">
            {post.tags && post.tags.length > 0 && (
                <div className="post-detail-tags">
                  <strong>태그:</strong>
                  {post.tags.map((tag, idx) => (
                      <span key={idx} className="tag-badge">#{tag.name}</span>
                  ))}
                </div>
            )}
            <h2 className="post-detail-title">{post.title}</h2>
            <p className="post-detail-category">카테고리: {post.categoryName}</p>
            <p className="post-detail-author">작성자: {post.authorName}</p>
            <p className="post-detail-views">조회수: {post.viewCount}</p>
            <div
                className="post-detail-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>


            {attachedStudy && (
                <div className="attached-study-card">
                  <div className="study-status">
                    {attachedStudy.currentMember >= attachedStudy.maxMember ? '마감' : '모집중'}
                  </div>
                  <h3>{attachedStudy.title}</h3>
                  <p><strong>스터디장:</strong> {attachedStudy.uname}</p>
                  <p><strong>카테고리:</strong> {attachedStudy.category || '-'}</p>
                  <p className="study-description">
                    {attachedStudy.description?.slice(0, 100)}...
                  </p>
                </div>
            )}

            <div className="button-group">
              <button onClick={handleBackClick} className="back-button">목록으로</button>
              {isAdmin && (
                  <button onClick={handleEditClick} className="edit-button">수정</button>
              )}
            </div>

            <hr />
            <div className="comment-section">
              <h3>댓글</h3>
              <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                  name="content"
                  placeholder="댓글 내용을 입력하세요"
                  value={newComment.content}
                  onChange={handleInputChange}
              />
                <button type="submit">댓글 등록</button>
              </form>

              <ul className="comment-list">
                {comments.length === 0 ? (
                    <li className="comment-item">댓글이 없습니다.</li>
                ) : (
                    comments.map((comment, index) => (
                        <li key={index} className="comment-item">
                          <strong>{comment.authorName} : </strong>{comment.content}
                          <span> • {timeAgo(comment.createdAt)}</span>
                        </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ 오른쪽 사이드 카드 */}

            <div className="post-detail-sidebar">
              <BoardStudyCard useremail={post.authorEmail} />
            </div>


      </div>
  );
}

export default PostDetail;
