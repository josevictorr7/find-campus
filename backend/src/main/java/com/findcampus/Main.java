package com.findcampus;

import com.findcampus.controller.*;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

/**
 * Ponto de entrada (Main) do servidor HTTP Back-end do Find Campus.
 * Inicializa o servidor HTTP na porta 8080 e registra os Controllers das rotas.
 */
public class Main {

    private static final int PORTA = 8080;

    public static void main(String[] args) {
        try {
            // Cria o servidor HTTP escutando na porta 8080
            HttpServer server = HttpServer.create(new InetSocketAddress(PORTA), 0);

            // Registro das rotas e mapeamento para seus respectivos Controllers (MVC)
            server.createContext("/login", new AuthController());
            server.createContext("/usuarios", new UsuarioController());
            server.createContext("/locais", new LocalController());
            server.createContext("/objetos", new ObjetoController());
            server.createContext("/devolucoes", new DevolucaoController());

            // Define o executor nulo (utiliza o padrão default)
            server.setExecutor(null);

            // Inicia a escuta de requisições
            server.start();

            System.out.println("Servidor UNIP Achados e Perdidos iniciado com sucesso!");
            System.out.println("Endereço: http://localhost:" + PORTA);
            System.out.println("Arquitetura: MVC + DAO/DAL (REST API HTTP)");

            // Testa a integração com o Banco de Dados MySQL (DAL) ao iniciar
            com.findcampus.dal.DatabaseConfig.testarConexao();

        } catch (IOException e) {
            System.err.println("Erro ao iniciar o servidor HTTP: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
