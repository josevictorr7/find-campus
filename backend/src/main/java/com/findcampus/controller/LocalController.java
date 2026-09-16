package com.findcampus.controller;

import com.findcampus.dao.LocalDAO;
import com.findcampus.model.Local;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;


 // Controller responsável pelas requisições no endpoint de Locais (/locais).

public class LocalController extends BaseController implements HttpHandler {

    private final LocalDAO localDAO = new LocalDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        aplicarCors(exchange);
        if (ehPreFlightOptions(exchange)) return;

        String method = exchange.getRequestMethod().toUpperCase();

        switch (method) {
            case "GET":
                List<Local> lista = localDAO.listar();
                enviarRespostaJson(exchange, 200, lista);
                break;

            case "POST":
                Map<String, Object> bodyPost = lerCorpoRequisicao(exchange);
                Local novoLocal = new Local(
                        obterString(bodyPost, "nome"),
                        obterString(bodyPost, "bloco")
                );
                boolean inserido = localDAO.inserir(novoLocal);
                enviarRespostaJson(exchange, 201, Map.of("ok", inserido));
                break;

            case "PUT":
                Map<String, Object> bodyPut = lerCorpoRequisicao(exchange);
                Local localAtualizar = new Local(
                        obterInteiro(bodyPut, "id"),
                        obterString(bodyPut, "nome"),
                        obterString(bodyPut, "bloco")
                );
                boolean atualizado = localDAO.atualizar(localAtualizar);
                enviarRespostaJson(exchange, 200, Map.of("ok", atualizado));
                break;

            case "DELETE":
                Map<String, Object> bodyDel = lerCorpoRequisicao(exchange);
                int idDeletar = obterInteiro(bodyDel, "id");
                boolean deletado = localDAO.deletar(idDeletar);
                enviarRespostaJson(exchange, 200, Map.of("ok", deletado));
                break;

            default:
                enviarRespostaJson(exchange, 405, Map.of("erro", "Método HTTP não permitido"));
                break;
        }
    }
}
