package com.marcuseisele.webchat.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MessageDTO {
    private String name;
    private String content;

}
