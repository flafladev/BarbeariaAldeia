package com.barbearia.aldeia.controller;

import com.barbearia.aldeia.dao.AgendamentoDAO;
import com.barbearia.aldeia.model.Agendamento;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.stream.Collectors;

@WebServlet("/agendamento")
public class AgendamentoServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");

        try {
            String nome = req.getParameter("nome");
            String telefone = req.getParameter("telefone");
            String[] servicosArray = req.getParameterValues("servicos");
            String[] adicionaisArray = req.getParameterValues("adicionais");
            String dataStr = req.getParameter("data");
            String horaStr = req.getParameter("hora");
            String barbeiroParam = req.getParameter("barbeiro");

            // Validações
            if (nome == null || nome.trim().isEmpty() ||
                telefone == null || telefone.trim().isEmpty() ||
                servicosArray == null || servicosArray.length == 0 ||
                dataStr == null || dataStr.isEmpty() ||
                horaStr == null || horaStr.isEmpty()) {
                resp.sendRedirect(req.getContextPath() + "/agendamento.html?erro=" + URLEncoder.encode("Preencha todos os campos obrigatórios.", "UTF-8"));
                return;
            }

            LocalDate data = LocalDate.parse(dataStr);
            if (data.isBefore(LocalDate.now())) {
                resp.sendRedirect(req.getContextPath() + "/agendamento.html?erro=" + URLEncoder.encode("A data não pode ser no passado.", "UTF-8"));
                return;
            }

            LocalTime hora = LocalTime.parse(horaStr);
            if (hora.isBefore(LocalTime.of(8, 0)) || hora.isAfter(LocalTime.of(20, 0))) {
                resp.sendRedirect(req.getContextPath() + "/agendamento.html?erro=" + URLEncoder.encode("Horário permitido apenas das 08:00 às 20:00.", "UTF-8"));
                return;
            }

            String servicos = Arrays.stream(servicosArray).collect(Collectors.joining(", "));
            String adicionais = (adicionaisArray != null) ? Arrays.stream(adicionaisArray).collect(Collectors.joining(", ")) : "";

            Integer barbeiroId = (barbeiroParam != null && !barbeiroParam.isEmpty()) ? Integer.parseInt(barbeiroParam) : null;

            Agendamento agendamento = new Agendamento(nome, telefone, servicos, adicionais, data, hora, barbeiroId);
            AgendamentoDAO dao = new AgendamentoDAO();
            dao.salvar(agendamento);

            // Redirecionar para confirmação com parâmetros na URL
            String url = req.getContextPath() + "/confirmacao.html?"
    + "nome=" + URLEncoder.encode(nome, "UTF-8")
    + "&telefone=" + URLEncoder.encode(telefone, "UTF-8")
    + "&servicos=" + URLEncoder.encode(servicos, "UTF-8")
    + "&adicionais=" + URLEncoder.encode(adicionais, "UTF-8")
    + "&data=" + dataStr
    + "&hora=" + horaStr
    + "&barbeiro=" + URLEncoder.encode(barbeiroId != null ? (barbeiroId == 1 ? "Roger" : "Carlos") : "Indiferente", "UTF-8");

        } catch (DateTimeParseException | NumberFormatException e) {
            e.printStackTrace();
            resp.sendRedirect(req.getContextPath() + "/agendamento.html?erro=" + URLEncoder.encode("Formato de data/hora inválido.", "UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendRedirect(req.getContextPath() + "/agendamento.html?erro=" + URLEncoder.encode("Erro interno no servidor.", "UTF-8"));
        }
    }
}