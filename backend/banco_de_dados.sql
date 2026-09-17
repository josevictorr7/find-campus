-- Criação do banco de dados para a aplicação UNIP Achados e Perdidos
CREATE DATABASE IF NOT EXISTS trabalho_facul;
USE trabalho_facul;

-- Tabela USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    ra         VARCHAR(50) NOT NULL,
    nome       VARCHAR(100) NOT NULL,
    senha      VARCHAR(255) NOT NULL,
    tipo       VARCHAR(50) NOT NULL DEFAULT 'aluno'
) ENGINE=InnoDB;

-- Tabela OBJETOS
CREATE TABLE IF NOT EXISTS objetos (
    id_objeto INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    descricao TEXT,
    cor       VARCHAR(50),
    marca     VARCHAR(100),
    status    VARCHAR(50) NOT NULL,
    local     VARCHAR(255),
    contato   VARCHAR(255),
    usuario   INT,

    CONSTRAINT fk_objetos_usuario FOREIGN KEY (usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela DEVOLUCOES
CREATE TABLE IF NOT EXISTS devolucoes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    objeto     INT NOT NULL,
    usuario    INT NOT NULL,
    data       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,

    CONSTRAINT fk_devolucoes_objeto  FOREIGN KEY (objeto)  REFERENCES objetos(id_objeto) ON DELETE CASCADE,
    CONSTRAINT fk_devolucoes_usuario FOREIGN KEY (usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Carga Inicial de Dados de Teste
INSERT INTO usuarios (ra, nome, senha, tipo) VALUES 
('123456', 'Administrador UNIP', '123456', 'admin'),
('202611', 'Aluno Exemplo', '123456', 'aluno');
