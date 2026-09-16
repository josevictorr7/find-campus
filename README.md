# UNIP Achados e Perdidos

Sistema acadêmico web para gestão, localização e controle de devoluções de pertences achados e perdidos dentro do campus universitário.

---

## 1. Objetivo do Trabalho

O objetivo principal deste projeto acadêmico é desenvolver um sistema funcional completo implementando o padrão de operações **CRUD (Create, Read, Update, Delete)**, integrado a um banco de dados relacional MySQL.

---

## 2. Sobre o Software

O **UNIP Achados e Perdidos** permite que usuários autenticados via Registro Acadêmico (RA):
- Registrem objetos perdidos ou encontrados especificando detalhes como nome, cor, marca, descrição e local.
- Consultem o catálogo de pertences com filtros por status (`Perdido`, `Encontrado`, `Devolvido`) e busca textual instantânea.
- Gerenciem seus próprios pertences cadastrados.
- Registrem o histórico formal de devoluções entregues aos respectivos donos (Painel Administrativo).

---

## 3. Arquitetura e Tecnologias

### Back-end (Java)
- **Linguagem**: Java 17+ puro, apenas com bibliotecas, sem uso de frameworks.
- **Arquitetura**:
  - **MVC (Model-View-Controller)**: Separação de modelos de dados (`model`), controladores de requisição HTTP (`controller`) e a visão tratada pelo front-end.
  - **DAO (Data Access Object)**: Classes dedicadas no pacote `com.findcampus.dao` para encapsular todas as instruções SQL via `PreparedStatement`.
  - **DAL (Data Access Layer)**: Gerenciamento centralizado da conexão JDBC e tratamento de exceções MySQL no pacote `com.findcampus.dal`.
- **Dependências externas**:
  - `Gson 2.10.1`: Serialização e desserialização de objetos JSON.
  - `MySQL Connector/J 8.0.33`: Driver JDBC oficial para comunicação com o banco de dados.

### Front-end (React + TypeScript)
- **Linguagem / Framework**: React 18, TypeScript, Vite.
- **Estilização**: Tailwind CSS (design moderno, responsivo e dark/light contrast).
- **Ícones**: Lucide React.
- **Roteamento**: React Router DOM v6.

### Banco de Dados
- **SGBD**: MySQL 8.0.

---

## 4. Dump do Banco de Dados (SQL)

Para criar a estrutura de tabelas e cargas iniciais no seu servidor MySQL local, execute o arquivo `backend/banco_de_dados.sql` ou utilize os scripts abaixo:

```sql
CREATE DATABASE IF NOT EXISTS trabalho_facul;
USE trabalho_facul;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    ra         VARCHAR(50) NOT NULL,
    nome       VARCHAR(100) NOT NULL,
    senha      VARCHAR(255) NOT NULL,
    tipo       VARCHAR(50) NOT NULL DEFAULT 'aluno'
) ENGINE=InnoDB;

-- Tabela de Objetos
CREATE TABLE IF NOT EXISTS objetos (
    id_objeto INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    descricao TEXT,
    cor       VARCHAR(50),
    marca     VARCHAR(100),
    status    VARCHAR(50) NOT NULL,
    local     VARCHAR(255),
    local_id  VARCHAR(255),
    contato   VARCHAR(255),
    usuario   INT,
    CONSTRAINT fk_objetos_usuario FOREIGN KEY (usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela de Devoluções
CREATE TABLE IF NOT EXISTS devolucoes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    objeto     INT NOT NULL,
    usuario    INT NOT NULL,
    data       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    CONSTRAINT fk_devolucoes_objeto  FOREIGN KEY (objeto)  REFERENCES objetos(id_objeto) ON DELETE CASCADE,
    CONSTRAINT fk_devolucoes_usuario FOREIGN KEY (usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Usuários Padrão para Testes
INSERT INTO usuarios (ra, nome, senha, tipo) VALUES 
('123456', 'Administrador UNIP', '123456', 'admin'),
('202611', 'Aluno Exemplo', '123456', 'aluno');
```

---

## 6. Como Executar o Projeto Localmente

### Pré-requisitos
- **Java JDK 17** ou superior instalado.
- **Node.js 18+** e **npm** instalados.
- Servidor **MySQL 8.0+** ativo na máquina local (ou nuvem).

---

### Passo 1: Configuração do Banco de Dados
1. Inicie seu serviço MySQL.
2. Importe o script `backend/banco_de_dados.sql` no seu MySQL Client (Workbench, DBeaver ou via linha de comando).
3. Verifique as credenciais de acesso ao banco no arquivo `backend/src/main/java/com/findcampus/dal/DatabaseConfig.java`:
   ```java
   private static final String URL = "jdbc:mysql://localhost:3306/seu_banco";
   private static final String USER = "seu_usuario";
   private static final String PASS = "sua_senha";
   ```

---

### Passo 2: Execução do Back-end (Servidor Java)

#### Opção A — Pela IDE (IntelliJ IDEA / Eclipse / VS Code)
1. Abra a pasta `backend` na sua IDE de preferência.
2. Adicione os arquivos `.jar` contidos na pasta `backend/lib/` ao Classpath do projeto.
3. Execute a classe `com.findcampus.Main`.
4. O servidor iniciará na porta **8080** exibindo o log de confirmação da conexão MySQL no console.

#### Opção B — Via Linha de Comando (Terminal / Bash)
No diretório `backend`, execute:

```bash
# Compilar os arquivos fonte
find src/main/java -name "*.java" | xargs javac -cp "lib/gson-2.10.1.jar:lib/mysql-connector-j-8.0.33.jar" -d bin

# Executar a aplicação
java -cp "bin:lib/gson-2.10.1.jar:lib/mysql-connector-j-8.0.33.jar" com.findcampus.Main
```

---

### Passo 3: Execução do Front-end (React + Vite)

No diretório `frontend`, execute:

```bash
# Instalar as dependências do projeto Node
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse no seu navegador a URL indicada pelo Vite (geralmente `http://localhost:5173` ou `http://localhost:3000`).

---

## 8. Autoria

Trabalho acadêmico desenvolvido para a **UNIP (Universidade Paulista)** referente à disciplina Banco de Dados.

Alunos:

- José Victor Souza Silva - RA: R8740F6 - Turma: CC4P17
- Marcio Rafael Cisterna da Silva - RA: R2154H8 - Turma: CC4Q17
- Nicole Reliquia - RA:  - Turma: 
- Diego Lubek Moura da Silva - RA: R825HF3 - Turma: CC4P17
- Carlos Eduardo - RA:  - Turma: 
- Samuel Henri da Luz Nogueira - RA: H713BE6 - Turma: CC4Q17
