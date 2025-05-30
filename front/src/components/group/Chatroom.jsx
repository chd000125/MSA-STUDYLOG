import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from "../../api/ChatApi.js";
import {WS_URL} from "../../api/ChatApi.js";
import '../../style/group/ChatRoom.css';

const ChatRoom = ({ groupId, userEmail, userName }) => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const stompRef = useRef(null);
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const isSelfMessageRef = useRef(false);
    const [showNewMessageNotice, setShowNewMessageNotice] = useState(false);
    const userEmailRef = useRef(userEmail);
    const userNameRef = useRef(userName);

    useEffect(() => {
        userEmailRef.current = userEmail;
        userNameRef.current = userName;
        console.log(userEmail + userName)
    }, [userEmail, userName]);

    const scrollToBottom = () => {
        const el = chatMessagesRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
            setShowNewMessageNotice(false);
        }
    };


    const isNearBottom = () => {
        const el = chatMessagesRef.current;
        return el ? el.scrollHeight - el.scrollTop - el.clientHeight < 50 : false;
    };


    useEffect(() => {
        if (!groupId) return;
        api.get(`/api/group/chat/${groupId}/messages`)

            .then((res) => {
                setMessages(res.data)
                setTimeout(() => scrollToBottom(), 0);
            });

        const socket = new SockJS(WS_URL);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.subscribe(`/topic/chat/study-group/${groupId}`, (msg) => {
                    const body = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, body]);

                    if (body.userEmail !== userEmailRef.current) {
                        if (!isNearBottom()) {
                            setShowNewMessageNotice(true);
                        }
                    } else {
                        isSelfMessageRef.current = true;
                        scrollToBottom();
                    }
                });
            },
        });

        stompClient.activate();
        stompRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [groupId]);


    function formatKakaoTime(localDateTimeStr) {
        if (!localDateTimeStr) return '';

        const trimmedStr = localDateTimeStr.split('.')[0];
        const date = new Date(trimmedStr);
        if (isNaN(date)) return '시간 오류';

        const now = new Date();

        const isToday =
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate();

        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const hour = date.getHours();
        const minute = date.getMinutes().toString().padStart(2, '0');
        const ampm = hour < 12 ? '오전' : '오후';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;

        const timeStr = `${ampm} ${displayHour}:${minute}`;

        if (isToday) {
            return timeStr;
        } else {
            const dateStr = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
            return (
                <>
                    {dateStr}
                    <br />
                    {timeStr}
                </>
            );
        }
    }


    useEffect(() => {
        if (isSelfMessageRef.current) {
            scrollToBottom();
            isSelfMessageRef.current = false;
        }
    }, [messages]);

    const handleSend = () => {
        if (!content.trim() || !stompRef.current?.connected) return;

        const dto = { groupId, userEmail, userName, content };
        stompRef.current.publish({
            destination: `/app/chat/study-group/${groupId}`,
            body: JSON.stringify(dto),
        });

        isSelfMessageRef.current = true;
        setContent('');
    };


    const getColorFromName = (name) => {
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a9a9a9', '#00bcd4', '#ff69b4', '#4caf50'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const Avatar = ({ name }) => {
        const initial = name?.charAt(0) || '?';
        const bgColor = getColorFromName(name);

        return (
            <div style={{
                backgroundColor: bgColor,
                color: 'white',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 16,
                marginRight: 8,
                flexShrink: 0
            }}>
                {initial}
            </div>
        );
    };


    const handleNewMessageClick = () => scrollToBottom();

    return (
        <div className="chat-container">
            <div className="chat-messages" ref={chatMessagesRef}>
                {messages.map((msg, i) => {
                    const isMe = String(msg.userEmail || '').toLowerCase() === String(userEmail || '').toLowerCase();
                    const isSameUserAsPrevious = i > 0 && messages[i - 1].userEmail === msg.userEmail;

                    return (
                        <div
                            key={`${msg.id || 'no-id'}-${msg.createdAt || i}`}
                            className={`chat-message ${isMe ? 'me' : 'other'}`}
                        >
                            {/* ✅ 본인 메시지 아니면서 이전과 다른 유저일 때만 표시 */}
                            {!isMe && !isSameUserAsPrevious && (
                                <div className="chat-profile">
                                    <Avatar name={msg.userName} />
                                    <strong className="chat-username">
                                        {msg.userName}
                                    </strong>
                                </div>
                            )}
                            <div className="bubble-row">
                                <div className="chat-bubble">{msg.content}</div>
                                <div className="chat-time">{formatKakaoTime(msg.createdAt)}</div>
                            </div>
                        </div>
                    );
                })}
                {showNewMessageNotice && (
                    <div className="new-message-notice" onClick={handleNewMessageClick}>
                        📩 새로운 메시지
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="메시지를 입력하세요"
                    className="chat-input"
                />
                <button onClick={handleSend} className="chat-button">보내기</button>
            </div>
        </div>
    );
};

export default ChatRoom;
