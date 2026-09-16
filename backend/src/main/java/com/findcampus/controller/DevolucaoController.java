package com.findcampus.controller;

import com.findcampus.dao.DevolucaoDAO;
import com.findcampus.model.Devolucao;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;


 // Controller responsável pelas requisições no endpoint de Devoluções (/devolucoes).
 // Trata o CRUD completo (GET, POST, PUT, DELETE).

public class DevolucaoController extends BaseController implements HttpHandler {

    private final DevolucaoDAO devolucaoDAO = new DevolucaoDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        aplicarCors(exchange);
        if (ehPreFlightOptions(exchange)) return;

        String method = exchange.getRequestMethod().toUpperCase();

        switch (method) {
            case "GET":
                List<Devolucao> lista = devolucaoDAO.listar();
                enviarRespostaJson(exchange, 200, lista);
                break;

            case "POST":
                Map<String, Object> bodyPost = lerCorpoRequisicao(exchange);
                Devolucao novaDev = new Devolucao(
                        0,
                        obterInteiro(bodyPost, "objeto"),
                        obterInteiro(bodyPost, "usuario"),
                        null,
                        obterString(bodyPost, "observacao")
                );
                boolean inserida = devolucaoDAO.inserir(novaDev);
                enviarRespostaJson(exchange, 201, Map.of("ok", inserida));
                break;

            case "PUT":
                Map<String, Object> bodyPut = lerCorpoRequisicao(exchange);
                Devolucao devAtualizar = new Devolucao(
                        obterInteiro(bodyPut, "id"),
                        obterInteiro(bodyPut, "objeto"),
                        obterInteiro(bodyPut, "usuario"),
                        null,
                        obterString(bodyPut, "observacao")
                );
                boolean atualizada = devolucaoDAO.atualizar(devAtualizar);
                enviarRespostaJson(exchange, 200, Map.of("ok", atualizada));
                break;

            case "DELETE":
                Map<String, Object> bodyDel = lerCorpoRequisicao(exchange);
                int idDeletar = obterInteiro(bodyDel, "id");
                boolean deletada = devolucaoDAO.deletar(idDeletar);
                enviarRespostaJson(exchange, 200, Map.of("ok", deletada));
                break;

            default:
                enviarRespostaJson(exchange, 405, Map.of("erro", "Método HTTP não permitido"));
                break;
        }
    }
}
