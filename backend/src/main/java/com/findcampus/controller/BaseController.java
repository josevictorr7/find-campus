package com.findcampus.controller;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;


// Controller Base com utilitários para tratamento de requisições HTTP REST.
// Centraliza tratamento de cabeçalhos CORS, parse de JSON e escrita de respostas.

public abstract class BaseController {

    protected static final Gson gson = new Gson();

    // Aplica regras CORS no cabecário, permitindo comunicação do front-end e back-end em locais diferentes.

    protected void aplicarCors(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }


    protected boolean ehPreFlightOptions(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return true;
        }
        return false;
    }

     // Lê o corpo JSON da requisição HTTP e o converte para um Map.

    protected Map<String, Object> lerCorpoRequisicao(HttpExchange exchange) throws IOException {
        String json = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        if (json.trim().isEmpty()) {
            return Map.of();
        }
        return gson.fromJson(json, Map.class);
    }

    // Envia uma resposta HTTP formatada em JSON para o cliente.

    protected void enviarRespostaJson(HttpExchange exchange, int statusCode, Object dados) throws IOException {
        byte[] respostaBytes = gson.toJson(dados).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, respostaBytes.length);
        exchange.getResponseBody().write(respostaBytes);
        exchange.getResponseBody().close();
    }

    // Utilitário para extrair números inteiros com segurança do Map do JSON.

    protected int obterInteiro(Map<String, Object> map, String chave) {
        Object val = map.get(chave);
        if (val instanceof Number) {
            return ((Number) val).intValue();
        }
        return 0;
    }

    // Utilitário para extrair Strings do Map do JSON.

    protected String obterString(Map<String, Object> map, String chave) {
        Object val = map.get(chave);
        return val != null ? val.toString() : "";
    }
}
