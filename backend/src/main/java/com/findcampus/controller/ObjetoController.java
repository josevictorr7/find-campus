package com.findcampus.controller;

import com.findcampus.dao.ObjetoDAO;
import com.findcampus.model.Objeto;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Controller responsável pelas requisições no endpoint de Objetos (/objetos).
 */
public class ObjetoController extends BaseController implements HttpHandler {

    private final ObjetoDAO objetoDAO = new ObjetoDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        aplicarCors(exchange);
        if (ehPreFlightOptions(exchange)) return;

        String method = exchange.getRequestMethod().toUpperCase();

        switch (method) {
            case "GET":
                List<Objeto> lista = objetoDAO.listar();
                enviarRespostaJson(exchange, 200, lista);
                break;

            case "POST":
                Map<String, Object> bodyPost = lerCorpoRequisicao(exchange);
                String localPost = obterString(bodyPost, "local");
                if (localPost.isEmpty()) localPost = obterString(bodyPost, "local_id");
                
                Objeto novoObjeto = new Objeto(
                        0,
                        obterString(bodyPost, "nome"),
                        obterString(bodyPost, "descricao"),
                        obterString(bodyPost, "cor"),
                        obterString(bodyPost, "marca"),
                        obterString(bodyPost, "status"),
                        localPost,
                        obterString(bodyPost, "contato"),
                        obterInteiro(bodyPost, "usuario")
                );
                boolean inserido = objetoDAO.inserir(novoObjeto);
                enviarRespostaJson(exchange, 201, Map.of("ok", inserido));
                break;

            case "PUT":
                Map<String, Object> bodyPut = lerCorpoRequisicao(exchange);
                String localPut = obterString(bodyPut, "local");
                if (localPut.isEmpty()) localPut = obterString(bodyPut, "local_id");

                Objeto objAtualizar = new Objeto(
                        obterInteiro(bodyPut, "id_objeto"),
                        obterString(bodyPut, "nome"),
                        obterString(bodyPut, "descricao"),
                        obterString(bodyPut, "cor"),
                        obterString(bodyPut, "marca"),
                        obterString(bodyPut, "status"),
                        localPut,
                        obterString(bodyPut, "contato"),
                        obterInteiro(bodyPut, "usuario")
                );
                boolean atualizado = objetoDAO.atualizar(objAtualizar);
                enviarRespostaJson(exchange, 200, Map.of("ok", atualizado));
                break;

            case "DELETE":
                Map<String, Object> bodyDel = lerCorpoRequisicao(exchange);
                int idDeletar = obterInteiro(bodyDel, "id");
                boolean deletado = objetoDAO.deletar(idDeletar);
                enviarRespostaJson(exchange, 200, Map.of("ok", deletado));
                break;

            default:
                enviarRespostaJson(exchange, 405, Map.of("erro", "Método HTTP não permitido"));
                break;
        }
    }
}
