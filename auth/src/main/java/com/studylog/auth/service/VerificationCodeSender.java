package com.studylog.auth.service;

public interface VerificationCodeSender {
    void sendVerificationCode(String email);

    boolean verifyCode(String email, String code);
}
