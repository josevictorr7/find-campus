package com.findcampus.controller;

import com.findcampus.dao.UsuarioDAO;
import com.findcampus.model.Usuario;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Controller responsável pelas requisições no endpoint de Usuários (/usuarios).
 */
public class UsuarioController extends BaseController implements HttpHandler {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        aplicarCors(exchange);
        if (ehPreFlightOptions(exchange)) return;

        String method = exchange.getRequestMethod().toUpperCase();

        switch (method) {
            case "GET":
                List<Usuario> lista = usuarioDAO.listar();
                enviarRespostaJson(exchange, 200, lista);
                break;

            case "POST":
                Map<String, Object> bodyPost = lerCorpoRequisicao(exchange);
                Usuario novoUsuario = new Usuario(
                        obterString(bodyPost, "ra"),
                        obterString(bodyPost, "nome"),
                        obterString(bodyPost, "senha"),
                        obterString(bodyPost, "tipo")
                );
                boolean inserido = usuarioDAO.inserir(novoUsuario);
                enviarRespostaJson(exchange, 201, Map.of("ok", inserido));
                break;

            case "PUT":
                Map<String, Object> bodyPut = lerCorpoRequisicao(exchange);
                Usuario usuarioAtualizar = new Usuario(
                        obterInteiro(bodyPut, "id_usuario"),
                        obterString(bodyPut, "ra"),
                        obterString(bodyPut, "nome"),
                        obterString(bodyPut, "senha"),
                        obterString(bodyPut, "tipo")
                );
                boolean atualizado = usuarioDAO.atualizar(usuarioAtualizar);
                enviarRespostaJson(exchange, 200, Map.of("ok", atualizado));
                break;

            case "DELETE":
                Map<String, Object> bodyDel = lerCorpoRequisicao(exchange);
                int idDeletar = obterInteiro(bodyDel, "id");
                boolean deletado = usuarioDAO.deletar(idDeletar);
                enviarRespostaJson(exchange, 200, Map.of("ok", deletado));
                break;

            default:
                enviarRespostaJson(exchange, 405, Map.of("erro", "Método HTTP não permitido"));
                break;
        }
    }
}
