package com.findcampus.dao;

import com.findcampus.dal.DatabaseConfig;
import com.findcampus.model.Objeto;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Padrão DAO (Data Access Object) para a entidade Objeto.
 * Gerencia as operações na tabela 'objetos'.
 */
public class ObjetoDAO {

    public boolean inserir(Objeto objeto) {
        String sqlComLocalEContato = "INSERT INTO objetos (nome, descricao, cor, marca, status, local, contato, usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        String sqlComLocalIdEContato = "INSERT INTO objetos (nome, descricao, cor, marca, status, local_id, contato, usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection()) {
            try (PreparedStatement stmt = conn.prepareStatement(sqlComLocalEContato)) {
                stmt.setString(1, objeto.getNome());
                stmt.setString(2, objeto.getDescricao());
                stmt.setString(3, objeto.getCor());
                stmt.setString(4, objeto.getMarca());
                stmt.setString(5, objeto.getStatus());
                stmt.setString(6, objeto.getLocal());
                stmt.setString(7, objeto.getContato());
                stmt.setInt(8, objeto.getUsuario());
                return stmt.executeUpdate() > 0;
            } catch (SQLException exLocal) {
                try (PreparedStatement stmt = conn.prepareStatement(sqlComLocalIdEContato)) {
                    stmt.setString(1, objeto.getNome());
                    stmt.setString(2, objeto.getDescricao());
                    stmt.setString(3, objeto.getCor());
                    stmt.setString(4, objeto.getMarca());
                    stmt.setString(5, objeto.getStatus());
                    stmt.setString(6, objeto.getLocal());
                    stmt.setString(7, objeto.getContato());
                    stmt.setInt(8, objeto.getUsuario());
                    return stmt.executeUpdate() > 0;
                } catch (SQLException exLocalId) {
                    try (PreparedStatement stmt = conn.prepareStatement("INSERT INTO objetos (nome, descricao, cor, marca, status, usuario) VALUES (?, ?, ?, ?, ?, ?)")) {
                        stmt.setString(1, objeto.getNome());
                        stmt.setString(2, objeto.getDescricao());
                        stmt.setString(3, objeto.getCor());
                        stmt.setString(4, objeto.getMarca());
                        stmt.setString(5, objeto.getStatus());
                        stmt.setInt(6, objeto.getUsuario());
                        return stmt.executeUpdate() > 0;
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("Erro ao inserir objeto: " + e.getMessage());
            return false;
        }
    }

    public List<Objeto> listar() {
        List<Objeto> objetos = new ArrayList<>();
        String sql = "SELECT * FROM objetos";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                String loc = "";
                try {
                    loc = rs.getString("local");
                } catch (SQLException ignored) {
                    try {
                        loc = rs.getString("local_id");
                    } catch (SQLException ignored2) {}
                }

                String contato = "";
                try {
                    contato = rs.getString("contato");
                } catch (SQLException ignored) {}

                Objeto obj = new Objeto(
                        rs.getInt("id_objeto"),
                        rs.getString("nome"),
                        rs.getString("descricao"),
                        rs.getString("cor"),
                        rs.getString("marca"),
                        rs.getString("status"),
                        loc != null ? loc : "",
                        contato != null ? contato : "",
                        rs.getInt("usuario")
                );
                objetos.add(obj);
            }
        } catch (SQLException e) {
            System.err.println("Erro ao listar objetos: " + e.getMessage());
        }
        return objetos;
    }

    public boolean atualizar(Objeto objeto) {
        String sqlComLocal = "UPDATE objetos SET nome = ?, descricao = ?, cor = ?, marca = ?, status = ?, local = ?, contato = ?, usuario = ? WHERE id_objeto = ?";
        String sqlComLocalId = "UPDATE objetos SET nome = ?, descricao = ?, cor = ?, marca = ?, status = ?, local_id = ?, contato = ?, usuario = ? WHERE id_objeto = ?";

        try (Connection conn = DatabaseConfig.getConnection()) {
            try (PreparedStatement stmt = conn.prepareStatement(sqlComLocal)) {
                stmt.setString(1, objeto.getNome());
                stmt.setString(2, objeto.getDescricao());
                stmt.setString(3, objeto.getCor());
                stmt.setString(4, objeto.getMarca());
                stmt.setString(5, objeto.getStatus());
                stmt.setString(6, objeto.getLocal());
                stmt.setString(7, objeto.getContato());
                stmt.setInt(8, objeto.getUsuario());
                stmt.setInt(9, objeto.getIdObjeto());
                return stmt.executeUpdate() > 0;
            } catch (SQLException exLocal) {
                try (PreparedStatement stmt = conn.prepareStatement(sqlComLocalId)) {
                    stmt.setString(1, objeto.getNome());
                    stmt.setString(2, objeto.getDescricao());
                    stmt.setString(3, objeto.getCor());
                    stmt.setString(4, objeto.getMarca());
                    stmt.setString(5, objeto.getStatus());
                    stmt.setString(6, objeto.getLocal());
                    stmt.setString(7, objeto.getContato());
                    stmt.setInt(8, objeto.getUsuario());
                    stmt.setInt(9, objeto.getIdObjeto());
                    return stmt.executeUpdate() > 0;
                } catch (SQLException exLocalId) {
                    try (PreparedStatement stmt = conn.prepareStatement("UPDATE objetos SET nome = ?, descricao = ?, cor = ?, marca = ?, status = ?, usuario = ? WHERE id_objeto = ?")) {
                        stmt.setString(1, objeto.getNome());
                        stmt.setString(2, objeto.getDescricao());
                        stmt.setString(3, objeto.getCor());
                        stmt.setString(4, objeto.getMarca());
                        stmt.setString(5, objeto.getStatus());
                        stmt.setInt(6, objeto.getUsuario());
                        stmt.setInt(7, objeto.getIdObjeto());
                        return stmt.executeUpdate() > 0;
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar objeto: " + e.getMessage());
            return false;
        }
    }

    public boolean deletar(int idObjeto) {
        String sql = "DELETE FROM objetos WHERE id_objeto = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idObjeto);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao deletar objeto: " + e.getMessage());
            return false;
        }
    }
}
