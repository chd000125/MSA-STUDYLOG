import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function MainLayout() {
    return (
        <div>
            <Header />
            <div style={{
                marginTop: '10vh',
                minHeight: '90vh',
            }}>
                <Outlet /> {/* 여기에 하위 라우트들이 렌더링됩니다 */}
            </div>
            <Footer />
        </div>
    );
}

export default MainLayout;