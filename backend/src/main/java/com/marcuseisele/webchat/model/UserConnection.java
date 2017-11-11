package com.marcuseisele.webchat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

@Data
@AllArgsConstructor
public class UserConnection {
    private String userName;
    private WebSocketSession session;
}
