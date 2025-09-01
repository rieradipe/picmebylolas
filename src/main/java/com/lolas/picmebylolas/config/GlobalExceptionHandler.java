package com.lolas.picmebylolas.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /* -------------------- 409: integridad/únicos/FK -------------------- */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrity(DataIntegrityViolationException ex,
            HttpServletRequest req) {
        // Evitamos filtrar mensajes de BD; damos uno genérico.
        return build(HttpStatus.CONFLICT,
                "Conflicto de datos (integridad/únicos)",
                "Se ha producido un conflicto de integridad de datos.",
                null, req);
    }

    /*
     * -------------------- 400: Bean Validation en @RequestBody
     * --------------------
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpServletRequest req) {
        Map<String, Object> details = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            details.put(fe.getField(), fe.getDefaultMessage());
        }
        return build(HttpStatus.BAD_REQUEST,
                "Solicitud inválida (validación)",
                "Revise los campos enviados.",
                details, req);
    }

    /*
     * -------------------- 400: Bean Validation en @PathVariable / @RequestParam
     * --------------------
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException ex,
            HttpServletRequest req) {
        Map<String, Object> details = new LinkedHashMap<>();
        for (ConstraintViolation<?> v : ex.getConstraintViolations()) {
            details.put(v.getPropertyPath().toString(), v.getMessage());
        }
        return build(HttpStatus.BAD_REQUEST,
                "Solicitud inválida (restricciones)",
                "Revise los parámetros de la petición.",
                details, req);
    }

    /*
     * -------------------- 400: JSON mal formado / tipos incorrectos
     * --------------------
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleNotReadable(HttpMessageNotReadableException ex,
            HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST,
                "Cuerpo de la petición no legible",
                "JSON mal formado o tipos incorrectos.",
                null, req);
    }

    /*
     * -------------------- 400: tipos de parámetros / falta de parámetros
     * --------------------
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
            HttpServletRequest req) {
        String msg = "Parámetro '" + ex.getName() + "' con formato inválido.";
        return build(HttpStatus.BAD_REQUEST,
                "Solicitud inválida (tipos)",
                msg, null, req);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Object> handleMissingParam(MissingServletRequestParameterException ex,
            HttpServletRequest req) {
        String msg = "Falta el parámetro requerido '" + ex.getParameterName() + "'.";
        return build(HttpStatus.BAD_REQUEST,
                "Solicitud inválida (parámetros)",
                msg, null, req);
    }

    /*
     * -------------------- 404: no encontrado (JPA/DAO/tu código)
     * --------------------
     */
    @ExceptionHandler({ EntityNotFoundException.class, EmptyResultDataAccessException.class,
            NoSuchElementException.class })
    public ResponseEntity<Object> handleNotFound(RuntimeException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND,
                "Recurso no encontrado",
                ex.getMessage(), null, req);
    }

    /* -------------------- Respetar ResponseStatusException -------------------- */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatus(ResponseStatusException ex,
            HttpServletRequest req) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        String message = ex.getReason();
        return build(status,
                "Error de aplicación",
                (message == null || message.isBlank()) ? status.getReasonPhrase() : message,
                null, req);
    }

    /*
     * -------------------- 400 genérico para IllegalArgumentException
     * --------------------
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex,
            HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST,
                "Solicitud inválida",
                ex.getMessage(), null, req);
    }

    /* -------------------- helper común -------------------- */
    private ResponseEntity<Object> build(HttpStatus status,
            String error,
            String message,
            Map<String, Object> details,
            HttpServletRequest req) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", (error == null || error.isBlank()) ? status.getReasonPhrase() : error);
        if (message != null && !message.isBlank())
            body.put("message", message);
        if (req != null)
            body.put("path", req.getRequestURI());
        if (details != null && !details.isEmpty())
            body.put("details", details);
        return new ResponseEntity<>(body, new HttpHeaders(), status);
    }

    /*
     * -------------------- 404: recurso inexistente --------------------
     * Este handler captura los casos en que Spring no encuentra un recurso
     * estático o endpoint (por ejemplo, rutas mal escritas como /v3/api-docs
     * o favicon.ico). Sin este bloque, se enviaría un 500 genérico por el
     * fallback, lo cual confunde al cliente. Con este handler, devolvemos
     * correctamente un 404 Not Found.
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Object> handleNoResource(NoResourceFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND,
                "Recurso no encontrado",
                ex.getMessage(),
                null, req);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAny(Exception ex, HttpServletRequest req) {
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("exception", ex.getClass().getName());
        details.put("message", ex.getMessage());
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno", "Se ha producido un error inesperado.", details,
                req);
    }

}
