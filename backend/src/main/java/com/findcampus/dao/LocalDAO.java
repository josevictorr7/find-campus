package com.findcampus.dao;

import com.findcampus.dal.DatabaseConfig;
import com.findcampus.model.Local;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

 // Padrão DAO (Data Access Object) para a entidade Local.
 // Encapsula o CRUD da tabela 'locais'.

public class LocalDAO {

    public boolean inserir(Local local) {
        String sql = "INSERT INTO locais (nome, bloco) VALUES (?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, local.getNome());
            stmt.setString(2, local.getBloco());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao inserir local: " + e.getMessage());
            return false;
        }
    }

    public List<Local> listar() {
        List<Local> locais = new ArrayList<>();
        String sql = "SELECT id, nome, bloco FROM locais";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                locais.add(new Local(rs.getInt("id"), rs.getString("nome"), rs.getString("bloco")));
            }
        } catch (SQLException e) {
            System.err.println("Erro ao listar locais: " + e.getMessage());
        }
        return locais;
    }

    public boolean atualizar(Local local) {
        String sql = "UPDATE locais SET nome = ?, bloco = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, local.getNome());
            stmt.setString(2, local.getBloco());
            stmt.setInt(3, local.getId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar local: " + e.getMessage());
            return false;
        }
    }

    public boolean deletar(int id) {
        String sql = "DELETE FROM locais WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao deletar local: " + e.getMessage());
            return false;
        }
    }
}
