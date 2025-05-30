import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/admin/AdminUsers.css';
import { API } from "../../api/api.js";

function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        uName: '',
        uEmail: '',
        uPassword: '',
        uRole: 'USER'
    });
    const [searchUid, setSearchUid] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');

    const fetchUsers = async (page = 0, uid = searchUid, name = searchName, email = searchEmail) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.admin.getUsers(page, 10, uid, name, email);
            setUsers(Array.isArray(res.data.users) ? res.data.users : []);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err) => {
        setUsers([]);
        if (err.response) {
            if (err.response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/login', { state: { message: '세션이 만료되었습니다. 다시 로그인해주세요.' } });
            } else {
                setError(`서버 오류: ${err.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
            }
        } else if (err.request) {
            setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        } else {
            setError(err.message || '사용자 목록을 불러오지 못했습니다.');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            await API.admin.createUser(formData);
            setShowCreateModal(false);
            setFormData({ uName: '', uEmail: '', uPassword: '', uRole: 'USER' });
            fetchUsers(page);
            alert('사용자가 성공적으로 생성되었습니다.');
        } catch (err) {
            handleError(err);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await API.admin.updateUser(selectedUser.uId, {
                uName: formData.uName,
                uRole: formData.uRole
            });
            setShowEditModal(false);
            setSelectedUser(null);
            setFormData({ uName: '', uEmail: '', uPassword: '', uRole: 'USER' });
            fetchUsers(page);
            alert('사용자 정보가 성공적으로 수정되었습니다.');
        } catch (err) {
            handleError(err);
        }
    };

    const handleDeleteUser = async (uId) => {
        if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;
        try {
            await API.admin.deleteUser(uId);
            fetchUsers(page);
            alert('사용자가 성공적으로 삭제되었습니다.');
        } catch (err) {
            handleError(err);
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            uName: user.uName,
            uEmail: user.uEmail,
            uRole: user.uRole
        });
        setShowEditModal(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchUsers(0, searchUid, searchName, searchEmail);
    };

    useEffect(() => {
        fetchUsers(page, searchUid, searchName, searchEmail);
    }, [page]);

    return (
        <div className="users-section">
            <h3>사용자 관리</h3>
            <form className="search-form" onSubmit={handleSearch}>
                <input type="number" placeholder="UID" value={searchUid} onChange={e => setSearchUid(e.target.value)} />
                <input type="text" placeholder="이름" value={searchName} onChange={e => setSearchName(e.target.value)} />
                <input type="text" placeholder="이메일" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} />
                <button type="submit">검색</button>
                <button type="button" onClick={() => { setSearchUid(''); setSearchName(''); setSearchEmail(''); setPage(0); fetchUsers(0, '', '', ''); }}>초기화</button>
            </form>
            <button className="create-button" onClick={() => { setFormData({ uName: '', uEmail: '', uPassword: '', uRole: 'USER' }); setShowCreateModal(true); }}>새 사용자 추가</button>

            {loading ? (<p>로딩 중...</p>) : error ? (<div className="error-message">{error}</div>) : (
                <>
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th>UID</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>권한</th>
                            <th>계정삭제 신청일</th>
                            <th>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.uId}>
                                <td>{user.uId}</td>
                                <td>{user.uName}</td>
                                <td>{user.uEmail}</td>
                                <td><span className={`badge role-${user.uRole.toLowerCase()}`}>{user.uRole}</span></td>
                                <td>{user.deletedAt ? new Date(user.deletedAt).toLocaleDateString() : '-'}</td>
                                <td>
                                    <button onClick={() => openEditModal(user)}>✏️</button>
                                    <button onClick={() => handleDeleteUser(user.uId)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={() => setPage(page - 1)} disabled={page === 0}>이전</button>
                        <span>{page + 1} / {totalPages}</span>
                        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>다음</button>
                    </div>
                </>
            )}

            {showCreateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>새 사용자 추가</h3>
                        <form onSubmit={handleCreateUser}>
                            <div>
                                <label>이름</label>
                                <input type="text" value={formData.uName} onChange={(e) => setFormData({ ...formData, uName: e.target.value })} required />
                            </div>
                            <div>
                                <label>이메일</label>
                                <input type="email" value={formData.uEmail} onChange={(e) => setFormData({ ...formData, uEmail: e.target.value })} required />
                            </div>
                            <div>
                                <label>비밀번호</label>
                                <input type="password" value={formData.uPassword} onChange={(e) => setFormData({ ...formData, uPassword: e.target.value })} required />
                            </div>
                            <div>
                                <label>권한</label>
                                <select value={formData.uRole} onChange={(e) => setFormData({ ...formData, uRole: e.target.value })}>
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">생성</button>
                                <button type="button" onClick={() => setShowCreateModal(false)}>취소</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>사용자 정보 수정</h3>
                        <form onSubmit={handleUpdateUser}>
                            <div>
                                <label>이름</label>
                                <input type="text" value={formData.uName} onChange={(e) => setFormData({ ...formData, uName: e.target.value })} required />
                            </div>
                            <div>
                                <label>이메일</label>
                                <input type="email" value={formData.uEmail} disabled />
                            </div>
                            <div>
                                <label>권한</label>
                                <select value={formData.uRole} onChange={(e) => setFormData({ ...formData, uRole: e.target.value })}>
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">수정</button>
                                <button type="button" onClick={() => setShowEditModal(false)}>취소</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;
