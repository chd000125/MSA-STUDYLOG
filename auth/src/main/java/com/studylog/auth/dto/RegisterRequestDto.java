package com.studylog.auth.dto;



public class RegisterRequestDto {
    private String uEmail;
    private String uPassword;
    private String uName;

    public RegisterRequestDto(String uEmail, String uPassword, String uName) {
        this.uEmail = uEmail;
        this.uPassword = uPassword;
        this.uName = uName;
    }


    public String getuEmail() {
        return uEmail;
    }

    public String getuPassword() {
        return uPassword;
    }


    public String getuName() {
        return uName;
    }
}