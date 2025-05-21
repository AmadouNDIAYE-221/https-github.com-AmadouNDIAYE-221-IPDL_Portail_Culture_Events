package com.africaevents.backend.dto;

import java.io.Serializable;

/**
 * DTO pour les réponses génériques de l'API
 */
public class ResponseDTO implements Serializable {
    
    private boolean success;
    private String message;
    private Object data;
    
    public ResponseDTO() {
    }
    
    public ResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public ResponseDTO(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Object getData() {
        return data;
    }
    
    public void setData(Object data) {
        this.data = data;
    }
}
