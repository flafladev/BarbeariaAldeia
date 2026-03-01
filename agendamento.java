package com.barbearia.aldeia.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Agendamento {
    private int id;
    private String nome;
    private String telefone;
    private String servicos;
    private String adicionais;
    private LocalDate data;
    private LocalTime hora;
    private Integer barbeiroId;
    private String status;

    public Agendamento() {}

    public Agendamento(String nome, String telefone, String servicos, String adicionais,
                       LocalDate data, LocalTime hora, Integer barbeiroId) {
        this.nome = nome;
        this.telefone = telefone;
        this.servicos = servicos;
        this.adicionais = adicionais;
        this.data = data;
        this.hora = hora;
        this.barbeiroId = barbeiroId;
        this.status = "pendente";
    }

    // getters e setters (igual ao que você já tinha)
}