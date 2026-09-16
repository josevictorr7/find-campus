package com.findcampus.controller;

import com.findcampus.dao.UsuarioDAO;
import com.findcampus.model.Usuario;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.Map;

// Controller responsável pelo endpoint de Autenticação (/login).

public class AuthController extends BaseController implements HttpHandler {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        aplicarCors(exchange);
        if (ehPreFlightOptions(exchange)) return;

        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            Map<String, Object> body = lerCorpoRequisicao(exchange);
            String ra = obterString(body, "ra");
            String senha = obterString(body, "senha");

            Usuario usuario = usuarioDAO.autenticar(ra, senha);

            if (usuario != null) {
                enviarRespostaJson(exchange, 200, usuario);
            } else {
                enviarRespostaJson(exchange, 401, Map.of("erro", "RA ou senha inválidos"));
            }
        } else {
            enviarRespostaJson(exchange, 45, Map.of("erro", "Método HTTP não suportado em /login"));
        }
    }
}
