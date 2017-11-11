package com.marcuseisele.webchat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marcuseisele.webchat.dto.MessageDTO;
import com.marcuseisele.webchat.model.UserConnection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper mapper;
    ConcurrentHashMap<String, UserConnection> userConnections;

    public ChatWebSocketHandler() {
        this.userConnections = new ConcurrentHashMap<>();
        this.mapper = new ObjectMapper();
    }

    public void updateName(String sessionId, String newName) {
        if (this.userConnections.containsKey(sessionId)) {
            UserConnection userConnection = this.userConnections.get(sessionId);
            log.info("Changed username from {} to {}", userConnection.getUserName(), newName);
            userConnection.setUserName(newName);
        }
    }

    public List<String> getConnectedUsers() {
        return this.userConnections.values().stream().map(UserConnection::getUserName).collect(Collectors.toList());

    }

    public void putSession(UserConnection userConnection) {
        this.userConnections.put(userConnection.getSession().getId(), userConnection);
    }

    public void deleteSession(String sessionId) {
        this.userConnections.remove(sessionId);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("New session established: {}", session);
        UserConnection userConnection = new UserConnection(null, session);
        this.putSession(userConnection);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
        Object payload1 = message.getPayload();
        String payload = payload1.toString();
        System.out.println("Received: " + payload1);
        MessageDTO incomingMessage = mapper.readValue(payload, MessageDTO.class);

        //TODO: refactor to use handler classes for each message type
        String messageType = incomingMessage.getMessageType();
        log.info("Received message from type: {}.", messageType);

        if ("connect".equalsIgnoreCase(messageType)) {
            String userName = incomingMessage.getReference();
            this.updateName(session.getId(), userName);
            List<String> connectedUsers = getConnectedUsers();
            String users = mapper.writeValueAsString(connectedUsers);
            MessageDTO userList = new MessageDTO("userList", userName, users);
            String json = mapper.writeValueAsString(userList);
            session.sendMessage(new TextMessage(json));
            log.info("Received connect from user: {} and returned userList", userName);
            MessageDTO connect = new MessageDTO("connect", userName, "");
            sendMessageToAllButSender(session.getId(), mapper.writeValueAsString(connect));
        } else if ("sendText".equalsIgnoreCase(messageType)) {
            log.info("received text event from client");
            MessageDTO text = new MessageDTO("text", userConnections.get(session.getId()).getUserName(), incomingMessage.getContent());
            sendMessageToAllButSender(session.getId(), mapper.writeValueAsString(text));
        } else {
            log.info("Received message with unknown messageType: {}", messageType);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        System.out.println("Closed: " + session);

        MessageDTO disconnect = new MessageDTO("disconnect", userConnections.get(session.getId()).getUserName(), "");
        this.deleteSession(session.getId());
        sendMessageToAll(mapper.writeValueAsString(disconnect));
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    public void sendMessageToAll(String message) {
        TextMessage textMessage = new TextMessage(message);
        userConnections.values().stream()
                .forEach(userConnection -> {
                    try {
                        userConnection.getSession().sendMessage(textMessage);
                    } catch (IOException e) {
                        log.error("Error sending message to user {} with session {}.", userConnection.getUserName(), userConnection.getSession());
                    }
                });
    }

    public void sendMessageToAllButSender(String sessionId, String message) {
        TextMessage textMessage = new TextMessage(message);
        userConnections.values().stream().filter(userConnection -> !userConnection.getSession().getId().equalsIgnoreCase(sessionId))
                .forEach(userConnection -> {
                    try {
                        userConnection.getSession().sendMessage(textMessage);
                    } catch (IOException e) {
                        log.error("Error sending message to user {} with session {}.", userConnection.getUserName(), userConnection.getSession());
                    }
                });
    }
}