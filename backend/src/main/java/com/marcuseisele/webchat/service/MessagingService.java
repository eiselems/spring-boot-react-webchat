package com.marcuseisele.webchat.service;

import com.marcuseisele.webchat.dto.MessageDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MessagingService {

    private SimpMessagingTemplate simpMessagingTemplate;

    public MessagingService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void sendMessage(String name, String message) {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setName(name);
        messageDTO.setContent(message);
        log.info("Sending message to channel: " + messageDTO);
        simpMessagingTemplate.convertAndSend("/topic/greetings", messageDTO);
    }
}
