package com.barbearia.aldeia.controller;

import com.barbearia.aldeia.dao.AgendamentoDAO;
import com.barbearia.aldeia.model.Agendamento;
import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/historico")
public class HistoricoServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String telefone = req.getParameter("telefone");

        if (telefone == null || telefone.trim().isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"erro\":\"Telefone não informado\"}");
            return;
        }

        try {
            AgendamentoDAO dao = new AgendamentoDAO();
            List<Agendamento> agendamentos = dao.listarPorTelefone(telefone);
            Gson gson = new Gson();
            resp.getWriter().write(gson.toJson(agendamentos));
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"erro\":\"Erro no banco de dados\"}");
        }
    }
}