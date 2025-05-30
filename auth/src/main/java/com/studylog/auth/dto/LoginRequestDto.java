package com.studylog.auth.dto;


public class LoginRequestDto {
    private String uEmail;
    private String uPassword;

    public LoginRequestDto(String uEmail, String uPassword) {
        this.uEmail = uEmail;
        this.uPassword = uPassword;
    }

    public String getuPassword() {
        return uPassword;
    }

    public String getuEmail() {
        return uEmail;
    }
}