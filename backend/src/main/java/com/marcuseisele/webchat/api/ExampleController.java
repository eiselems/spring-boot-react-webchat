package com.marcuseisele.webchat.api;

import com.marcuseisele.webchat.dto.HelloMessage;
import com.marcuseisele.webchat.service.MessagingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class ExampleController {

    private MessagingService messagingService;

    public ExampleController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    @MessageMapping("/hello")
    public void getMessage(HelloMessage helloMessage) {
        log.info(helloMessage.toString());
        messagingService.sendMessage(helloMessage.getName(), helloMessage.getMessage());
    }
}
