package com.findcampus.dao;

import com.findcampus.dal.DatabaseConfig;
import com.findcampus.model.Devolucao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

 // Padrão DAO (Data Access Object) para a entidade Devolucao.
 // Gerencia os registros de devoluções efetuadas.

public class DevolucaoDAO {

    public boolean inserir(Devolucao devolucao) {
        String sql = "INSERT INTO devolucoes (objeto, usuario, observacao) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, devolucao.getObjeto());
            stmt.setInt(2, devolucao.getUsuario());
            stmt.setString(3, devolucao.getObservacao());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao inserir devolução: " + e.getMessage());
            return false;
        }
    }

    public List<Devolucao> listar() {
        List<Devolucao> devolucoes = new ArrayList<>();
        String sql = "SELECT id, objeto, usuario, data, observacao FROM devolucoes";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Devolucao dev = new Devolucao(
                        rs.getInt("id"),
                        rs.getInt("objeto"),
                        rs.getInt("usuario"),
                        rs.getString("data"),
                        rs.getString("observacao")
                );
                devolucoes.add(dev);
            }
        } catch (SQLException e) {
            System.err.println("Erro ao listar devoluções: " + e.getMessage());
        }
        return devolucoes;
    }

    public boolean atualizar(Devolucao devolucao) {
        String sql = "UPDATE devolucoes SET objeto = ?, usuario = ?, observacao = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, devolucao.getObjeto());
            stmt.setInt(2, devolucao.getUsuario());
            stmt.setString(3, devolucao.getObservacao());
            stmt.setInt(4, devolucao.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar devolução: " + e.getMessage());
            return false;
        }
    }

    public boolean deletar(int id) {
        String sql = "DELETE FROM devolucoes WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao deletar devolução: " + e.getMessage());
            return false;
        }
    }
}
