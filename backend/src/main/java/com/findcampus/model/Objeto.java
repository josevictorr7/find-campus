package com.findcampus.model;

/**
 * Modelo de Dados (MVC - Model) para a tabela 'objetos'.
 * Representa um objeto achado ou perdido no campus com informações de contato.
 */
public class Objeto {
    private int idObjeto;
    private String nome;
    private String descricao;
    private String cor;
    private String marca;
    private String status;  // 'Perdido', 'Encontrado' ou 'Devolvido'
    private String local;   // Local onde o objeto foi encontrado/perdido
    private String contato; // Meio de contato informado pelo cadastrador (Telefone, WhatsApp, E-mail, etc.)
    private int usuario;    // FK -> Usuario

    public Objeto() {}

    public Objeto(int idObjeto, String nome, String descricao, String cor, String marca, String status, String local, String contato, int usuario) {
        this.idObjeto = idObjeto;
        this.nome = nome;
        this.descricao = descricao;
        this.cor = cor;
        this.marca = marca;
        this.status = status;
        this.local = local;
        this.contato = contato;
        this.usuario = usuario;
    }

    // Getters e Setters
    public int getIdObjeto() {
        return idObjeto;
    }

    public void setIdObjeto(int idObjeto) {
        this.idObjeto = idObjeto;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public String getContato() {
        return contato;
    }

    public void setContato(String contato) {
        this.contato = contato;
    }

    public int getUsuario() {
        return usuario;
    }

    public void setUsuario(int usuario) {
        this.usuario = usuario;
    }
}
