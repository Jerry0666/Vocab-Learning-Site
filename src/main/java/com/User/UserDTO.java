package com.User;

public class UserDTO {
    private String username;
    private String sessionId;
    private int id; // the id in user table

    public void setUsername(String username) {this.username = username;}
    public String getUsername() {return username;}
    public void setSessionId(String sessionId) {this.sessionId = sessionId;}
    public String getSessionId() {return sessionId;}
    public void setId(int id) {this.id = id;}
    public int getId() {return id;}

}
