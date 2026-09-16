package com.findcampus.dao;

import com.findcampus.dal.DatabaseConfig;
import com.findcampus.model.Usuario;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Padrão DAO (Data Access Object) para a entidade Usuario.
 * Encapsula todas as operações de banco de dados (CRUD) relativas a usuários.
 */
public class UsuarioDAO {

    public Usuario autenticar(String ra, String senha) {
        String sql = "SELECT * FROM usuarios WHERE ra = ? AND senha = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, ra);
            stmt.setString(2, senha);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String tipo = "aluno";
                    try {
                        tipo = rs.getString("tipo");
                    } catch (SQLException ignored) {}

                    return new Usuario(
                            rs.getInt("id_usuario"),
                            rs.getString("ra"),
                            rs.getString("nome"),
                            rs.getString("senha"),
                            tipo != null ? tipo : "aluno"
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Erro ao autenticar usuário: " + e.getMessage());
        }
        return null;
    }

    public boolean inserir(Usuario usuario) {
        String sql = "INSERT INTO usuarios (ra, nome, senha, tipo) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, usuario.getRa());
            stmt.setString(2, usuario.getNome());
            stmt.setString(3, usuario.getSenha());
            stmt.setString(4, usuario.getTipo());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao inserir usuário: " + e.getMessage());
            return false;
        }
    }

    public List<Usuario> listar() {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT * FROM usuarios";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                String tipo = "aluno";
                try {
                    tipo = rs.getString("tipo");
                } catch (SQLException ignored) {}

                Usuario u = new Usuario(
                        rs.getInt("id_usuario"),
                        rs.getString("ra"),
                        rs.getString("nome"),
                        rs.getString("senha"),
                        tipo != null ? tipo : "aluno"
                );
                usuarios.add(u);
            }
        } catch (SQLException e) {
            System.err.println("Erro ao listar usuários: " + e.getMessage());
        }
        return usuarios;
    }

    public boolean atualizar(Usuario usuario) {
        String sql = "UPDATE usuarios SET ra = ?, nome = ?, senha = ?, tipo = ? WHERE id_usuario = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, usuario.getRa());
            stmt.setString(2, usuario.getNome());
            stmt.setString(3, usuario.getSenha());
            stmt.setString(4, usuario.getTipo());
            stmt.setInt(5, usuario.getIdUsuario());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar usuário: " + e.getMessage());
            return false;
        }
    }

    public boolean deletar(int idUsuario) {
        String sql = "DELETE FROM usuarios WHERE id_usuario = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idUsuario);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao deletar usuário: " + e.getMessage());
            return false;
        }
    }
}
