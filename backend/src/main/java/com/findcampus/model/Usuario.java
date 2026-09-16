package com.findcampus.model;

/**
 * Modelo de Dados (MVC - Model) para a tabela 'usuarios'.
 */
public class Usuario {
    private int idUsuario;
    private String ra;
    private String nome;
    private String senha;
    private String tipo;

    public Usuario() {}

    public Usuario(int idUsuario, String ra, String nome, String senha, String tipo) {
        this.idUsuario = idUsuario;
        this.ra = ra;
        this.nome = nome;
        this.senha = senha;
        this.tipo = tipo;
    }

    public Usuario(String ra, String nome, String senha, String tipo) {
        this.ra = ra;
        this.nome = nome;
        this.senha = senha;
        this.tipo = tipo;
    }

    // Getters e Setters
    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getRa() {
        return ra;
    }

    public void setRa(String ra) {
        this.ra = ra;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
