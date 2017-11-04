package com.marcuseisele.webchat.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class HelloMessage {

    private String name;
    private String message;

}