package com.findcampus.dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


// Camada de Acesso a Dados (DAL - Data Access Layer) / Configuração do Banco de Dados.

 public class DatabaseConfig {

    // Configurações de acesso ao banco de dados MySQL
    private static final String URL = "jdbc:mysql://mysql-3caff90e-carlosedduardo239-cd89.i.aivencloud.com:22412/trabalho_facul?sslMode=REQUIRED";
    private static final String USER = "avnadmin";
    private static final String PASS = "AVNS_DRiI4rtNFK6lTUtJ06Q";

    static {
        try {
            // Garante que o driver JDBC do MySQL seja carregado na memória
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Erro ao carregar o driver JDBC do MySQL: " + e.getMessage());
        }
    }


    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }

     // Testa a conexão com o banco de dados MySQL no momento de inicialização da aplicação

    public static boolean testarConexao() {
        System.out.println("\n[DAL] Testando conexão com o Banco de Dados MySQL...");
        try (Connection conn = getConnection()) {
            if (conn != null && !conn.isClosed()) {
                String databaseName = conn.getCatalog();
                System.out.println("[DAL] CONEXÃO COM O BANCO DE DADOS ESTABELECIDA COM SUCESSO!");
                System.out.println("   - Banco de Dados Conectado: " + (databaseName != null ? databaseName : "defaultdb"));
                System.out.println("   - Status: Ativo e respondendo\n");
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[DAL] FALHA AO CONECTAR COM O BANCO DE DADOS!");
            System.err.println("   - Mensagem de Erro: " + e.getMessage());
            System.err.println("   - Código de Erro SQL: " + e.getErrorCode() + "\n");
        }
        return false;
    }
}
