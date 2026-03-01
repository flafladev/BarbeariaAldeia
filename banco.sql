CREATE DATABASE barbearia_aldeia;
USE barbearia_aldeia;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','barbeiro') DEFAULT 'barbeiro'
);

INSERT INTO usuarios (nome, username, password_hash, role) VALUES
('Roger', 'roger', '$2a$10$sVHHgJjqkQxLxLxLxLxLxO0vXxXxXxXxXxXxXxXxXxXxXxXxXxX', 'barbeiro'),
('Carlos', 'carlos', '$2a$10$sVHHgJjqkQxLxLxLxLxLxO0vXxXxXxXxXxXxXxXxXxXxXxXxXxX', 'barbeiro');

CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    servicos TEXT NOT NULL,
    adicionais TEXT,
    data_agendamento DATE NOT NULL,
    hora_agendamento TIME NOT NULL,
    barbeiro_id INT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (barbeiro_id) REFERENCES usuarios(id)
);