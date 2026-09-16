package com.findcampus.model;


public class Local {
    private int id;
    private String nome;
    private String bloco;

    public Local() {}

    public Local(int id, String nome, String bloco) {
        this.id = id;
        this.nome = nome;
        this.bloco = bloco;
    }

    public Local(String nome, String bloco) {
        this.nome = nome;
        this.bloco = bloco;
    }

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getBloco() {
        return bloco;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }
}
