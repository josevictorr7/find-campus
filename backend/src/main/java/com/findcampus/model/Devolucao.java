package com.findcampus.model;


public class Devolucao {
    private int id;
    private int objeto;     // FK -> Objeto
    private int usuario;    // FK -> Usuario
    private String data;
    private String observacao;

    public Devolucao() {}

    public Devolucao(int id, int objeto, int usuario, String data, String observacao) {
        this.id = id;
        this.objeto = objeto;
        this.usuario = usuario;
        this.data = data;
        this.observacao = observacao;
    }

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getObjeto() {
        return objeto;
    }

    public void setObjeto(int objeto) {
        this.objeto = objeto;
    }

    public int getUsuario() {
        return usuario;
    }

    public void setUsuario(int usuario) {
        this.usuario = usuario;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
