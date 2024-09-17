Título do Projeto:
Software para uma cafeteria 

Descrição
Este é um software de aplicação web desenvolvido para uma cafeteria, projetado para atender as necessidades de três tipos de usuários: cliente, funcionário e dono. O sistema gerencia a parte visual para os clientes, o sistema de pedidos para os funcionários, e as funções administrativas para o dono.

Cliente: Visualiza a página principal e o cardápio.

Funcionário: Pode fazer pedidos em nome dos clientes, enviá-los via WhatsApp e armazenar os dados no banco de dados.

Dono: Além das funções do funcionário, pode adicionar ou remover funcionários e visualizar os dados armazenados no banco de dados, acessando uma tabela específica em uma nova página.

Instalações:

Baixe e instale o Node.js a partir do site oficial Node.js.

Verifica se foi instalado com o comando no Prompt de comando: npm --v 
Após isso será exibido a verção caso tenha instalado.

Coloque a pasta do projeto na área de trabalho ou crie uma nova pasta para começar do zero.

Uso da aplicação:

Navegue até a pasta do projeto usando o terminal

Após criar um utilize o comando no prompt: cd desktop 

Entretato por ocorre o seguinte problema 

Possivelmente se sua maquina estive usando oneDrive direto na área de trabalho vá onde está sua pasta Área de trabalho está  e copie o caminho de onde está localizada como por exemplo assim:

C:\Users\99999\OneDrive\Área de Trabalho

Para conseguir achar a pasta basta coloca no prompt de comando da seguinte forma 

cd "C:\Users\55919\OneDrive\Área de Trabalho"

Usando as "" para retira os espaçamentos caso tenha como nessa situação que Área de Trabalho está em PT-BR e utilizado cd (change directory) para navegar entre as pastas 

Assim você consegue encontra o dektop e da continuidade na aplicação

Fazemos a navegação até o projeto com o comando no prompt: cd sistema_login_nodejs <nome do arquivo>

Logo após acessar vamos inicializar o projeto usando o comando: npm init de enter até chegar na mensagem Is this Ok? (yes) Assim você digita Yes 

Instalação das Dependências:

Instale as bibliotecas necessárias executando os seguintes comandos
{ 
npm install --save express
npm install express-session
npm install body-parser
npm install mysql2

Comando para deixa o servidor online: node index.js
}

Caso tente roda com os comando dados terá um erro no caso pois não ter o banco de dados que está associado a aplicação 

Caso queira o roda o aplicação de forma correta crie no seu banco de dados as seguintes tabelas 
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL
);
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255),
    mesa INT,
    itens TEXT,
    valor_total DECIMAL(10, 2),
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Na maquina utilizada foi usado o banco de dados Myslq Workbench caso utilize outro modifique a seguinte parte do código da aplicação na linha 12 até a 17 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'login'
});

Dentro preencha os  dados corretos no caso somente mude o essa informações para a usadas na sua maquina 
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'login'

host = Onde está sua hospedagem 
user =  Nome do seu usuário usado
password = Senha do usuário usado   
database  = Seu banco de dados criado que nesse caso é o login onde contem a tabelas usuarios e pedidos

Arquitetura do Projeto
O projeto está organizado nas seguintes pastas: 

Sistema_login_nodejs{

node_modules: Contém todos os módulos e bibliotecas Node.js utilizados na aplicação.

public:{ Inclui todos os arquivos públicos que serão acessados diretamente pelos usuários, como estilos CSS, imagens e scripts JavaScript.
        css:
            Arquivos de estilos, tanto para telas grandes quanto para dispositivos móveis.
        img: 
            Imagens utilizadas na aplicação.
        js: 
            Scripts JavaScript responsáveis pela funcionalidade da interface do usuário.
}

views:{ Contém todos os arquivos de visualização HTML, como:
    index.html: 
        Página inicial.

    login.html: 
        Tela de login.

    funcionario.html:
        Interface para funcionários.

    dono.html:
        Interface para o dono.

    exibirPedidos.html: 
        Página para exibir os pedidos.
}

Arquivos Backend:{
    index.js:
    Arquivo principal que inicializa o servidor e gerencia as rotas.

    package.json:
    Contém metadados sobre o projeto e as dependências necessárias.

    package-lock.
    json: Armazena versões exatas de dependências instaladas para garantir que a instalação seja consistente entre diferentes ambientes.
}

}

Na funcão 

function sendOrderToWhatsApp(orderDetails)

Dentro do arquivo script.js e no funcionario_script.js onde tem a mesma função 

altere o valor da variavel
const phoneNumber = '+xxxxxxxxxxxxx';

para exporta para conversa que deseja testar 

