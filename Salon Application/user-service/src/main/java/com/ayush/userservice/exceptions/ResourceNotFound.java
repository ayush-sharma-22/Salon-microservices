package com.ayush.userservice.exceptions;

public class ResourceNotFound extends RuntimeException{
    String resourceName;
    String field;
    String fieldName;
    Long resourceId;

    public ResourceNotFound(){}

    public ResourceNotFound(String resourceName, String field, String fieldName) {
        super(String.format("%s not found with %s: %s", resourceName, field, fieldName));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldName = fieldName;
    }

    public ResourceNotFound(String resourceName, String field, Long resourceId) {
        super(String.format("%s not found with %s: %d", resourceName, field, resourceId));
        this.resourceName = resourceName;
        this.field = field;
        this.resourceId = resourceId;
    }
}
