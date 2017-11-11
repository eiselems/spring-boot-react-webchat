package com.marcuseisele.webchat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

@Data
@AllArgsConstructor
public class MessageDTO {
    private String messageType;
    private String reference;
    private String content;
}
