package com.marcuseisele.webchat.api;

import com.marcuseisele.webchat.service.MessagingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;

@Slf4j
@Component
public class StompConnectEvent implements ApplicationListener<SessionConnectEvent> {

    private MessagingService messagingService;

    public StompConnectEvent(MessagingService messagingService) {
        this.messagingService = messagingService;
    }


    public void onApplicationEvent(SessionConnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());

        String company = sha.getNativeHeader("identifier").get(0);
        log.info("Connect event [sessionId: " + sha.getSessionId() + "; company: " + company + " ]");
        messagingService.sendMessage("SYS", "<b>"+company + "</b> has joined the channel.");
    }



}