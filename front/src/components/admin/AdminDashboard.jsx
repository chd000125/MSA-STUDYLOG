import React from 'react';

function AdminDashboard() {
    return (
        <div className="dashboard-section">
            <h3>대시보드</h3>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h4>전체 사용자</h4>
                    <p>0명</p>
                </div>
                <div className="stat-card">
                    <h4>전체 게시글</h4>
                    <p>0개</p>
                </div>
                <div className="stat-card">
                    <h4>전체 스터디</h4>
                    <p>0개</p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard; 