const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const { error } = require('console');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'login'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});
app.use(session({ secret: 'djnajodhqodjwqdjq231', resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos da pasta 'assets'
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.use(express.json());

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            const user = results[0];
            const isPasswordValid = senha === user.senha;

            if (isPasswordValid) {
                req.session.login = email;
                req.session.cargo = user.cargo;

                let redirectURL = '/login';
                if (user.cargo === 'dono') {
                    redirectURL = '/login/dono';
                } else if (user.cargo === 'funcionario') {
                    redirectURL = '/login/funcionario';
                }

                res.json({ success: true, redirectURL });
            } else {
                res.json({ success: false, error: 'Senha inválida' });
            }
        } else {
            res.json({ success: false, error: 'Email ou senha inválidos' });
        }
    });
});
// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.login) {
        return next();
    } else {
        res.redirect('/');
    }
}

// Middleware para verificar se o usuário é dono
function isDono(req, res, next) {
    if (req.session.cargo === 'dono') {
        return next();
    } else {
        res.status(403).send('Acesso negado');
    }
}

// Middleware para verificar se o usuário é funcionário
function isFuncionario(req, res, next) {
    if (req.session.cargo === 'funcionario') {
        return next();
    } else {
        res.status(403).send('Acesso negado');
    }
}

app.get('/login', (req, res) => {
    if (req.session.login) {
        if (req.session.cargo === 'dono') {
            res.redirect('/login/dono');
        } else if (req.session.cargo === 'funcionario') {
            res.redirect('/login/funcionario');
        }
    } else {
        res.render('login'); 
    }
});

// Rota para a página do dono
app.get('/login/dono', isAuthenticated, isDono, (req, res) => {
    res.render('dono'); 
});

// Rota para a página do funcionário
app.get('/login/funcionario', isAuthenticated, isFuncionario, (req, res) => {
    res.render('funcionario'); 
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao encerrar a sessão:', err);
            return res.status(500).send('Erro ao encerrar a sessão');
        }
        res.redirect('/');
    });
});

app.get('/check-email', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: 'Email não fornecido.' });
    }

    const checkQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?';
    connection.query(checkQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao verificar o e-mail.' });
        }
        const exists = results[0].count > 0;
        return res.status(200).json({ exists });
    });
});


app.post('/add-funcionario', (req, res) => {
    const { email, senha } = req.body;
   
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email ou senha não podem ser nulos.' });
    }

  
    const checkQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?';
    connection.query(checkQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao verificar o e-mail.' });
        }
        
        if (results[0].count > 0) {
            return res.status(409).json({ error: 'Este e-mail já está em uso.' });
        }

        const query = 'INSERT INTO usuarios (email, senha, cargo) VALUES (?, ?, ?)';
        connection.query(query, [email, senha, 'funcionario'], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao adicionar o funcionário.' });
            }

            return res.status(200).json({ success: 'Usuário cadastrado com sucesso' });
        });
    });
});


app.post('/delete-funcionario', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email não pode ser nulo.' });
    }

    const query = 'DELETE FROM usuarios WHERE email = ?';
    connection.query(query, [email], (err, result) => {
        if (err) {
            console.error('Erro ao executar a query:', err);
            return res.status(500).json({ error: 'Erro ao deletar o funcionário.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Funcionário não encontrado.' });
        }

        return res.status(200).json({ success: 'Funcionário deletado com sucesso!' });
    });
});

app.post('/submit-order', (req, res) => {
    const order = req.body;


    res.status(200).send('Pedido recebido com sucesso!');
    const itens = JSON.stringify(order.items);
    const cliente = order.cliente;
    const mesa = order.mesa;
    const valor_total = order.totalAmount;

    const query = 'INSERT INTO pedidos (cliente, mesa, itens, valor_total) VALUES (?,?,?,?)';

    connection.query(query, [cliente, mesa, itens, valor_total], (err, result) => {
        if (err) {
            console.log('Erro ao inserir os dados do pedido', err);
            return res.status(500).send('Erro ao processar os pedidos');
        }
        console.log('Pedido realizado com sucesso, ID', result.insertId);
    });

});

app.listen(port, () => {
    console.log(`Servidor funcionando na porta ${port}`);
});


app.get('/exibir-pedidos', isAuthenticated, isDono, (req, res) => {
    const queryPedidos = 'SELECT * FROM pedidos';  
    const queryUsuarios = 'SELECT * FROM usuarios';  

    connection.query(queryPedidos, (err, pedidos) => {
        if (err) {
            return res.status(500).send('Erro ao buscar pedidos');
        }
        connection.query(queryUsuarios, (err,usuarios)=>{
            if (err){
                return res.status(500).send('Erro ao buscar pedidos');
            }
            res.render('exibirPedidos', { pedidos: pedidos, usuarios: usuarios});
        })
    });
});
app.put('/mesas/:idMesa', (req, res) => {
    const { estado, inicio, fim, nome_cliente, telefone_cliente } = req.body;
    const { idMesa } = req.params;

    if (estado === 'reservada') {
    
        const query = `
            SELECT * FROM reservas 
            WHERE mesa_id = ? 
            AND NOT (inicio >= ? OR fim <= ?)
        `;

        connection.query(query, [idMesa, fim, inicio], (err, results) => {
            
            if (err) {
                console.error('Erro ao verificar sobreposição:', err);
                return res.status(500).json({ message: 'Erro ao verificar sobreposição de horários' });
            }

         
            if (results.length > 0) {
                return res.status(400).json({ message: 'Mesa já reservada nesse horário' });
            }

          
            connection.query('UPDATE mesas SET estado = ? WHERE id = ?', [estado, idMesa], (err) => {
                if (err) {
                    console.error('Erro ao atualizar estado da mesa:', err);
                    return res.status(500).json({ message: 'Erro ao atualizar estado da mesa' });
                }

                const reservaQuery = 'INSERT INTO reservas (mesa_id, inicio, fim, nome_cliente, telefone_cliente) VALUES (?, ?, ?, ?, ?)';
                connection.query(reservaQuery, [idMesa, inicio, fim, nome_cliente, telefone_cliente], (err) => {
                    if (err) {
                        console.error('Erro ao inserir reserva:', err);
                        return res.status(500).json({ message: 'Erro ao realizar a reserva' });
                    }
                    res.json({ message: 'Reserva feita com sucesso!' });
                });
            });
        });
    } else {
        connection.query('UPDATE mesas SET estado = ? WHERE id = ?', [estado, idMesa], (err) => {
            if (err) {
                console.error('Erro ao atualizar estado da mesa:', err);
                return res.status(500).json({ message: 'Erro ao atualizar estado da mesa' });
            }
            res.json({ message: 'Estado da mesa atualizado com sucesso!' });
        });
    }
});


app.get('/mesas/reservas', (req, res) => {
    const reservasQuery = `
    SELECT id, mesa_id, DATE_FORMAT(inicio, '%d/%m/%Y %H:%i') AS inicio_formatado, 
    DATE_FORMAT(fim, '%d/%m/%Y %H:%i') AS fim_formatado, nome_cliente, telefone_cliente 
    FROM reservas
  `;
  
  connection.query(reservasQuery, (err, results) => {
    if (err) {
      console.error('Erro ao buscar reservas:', err);
      return res.status(500).json({ message: 'Erro ao buscar reservas' });
    }
  
    const reservasPorMesa = {};
  
    results.forEach(reserva => {
      const { mesa_id } = reserva;
      if (!reservasPorMesa[mesa_id]) {
        reservasPorMesa[mesa_id] = [];
      }
      reservasPorMesa[mesa_id].push(reserva);
    });
  
    res.json(reservasPorMesa);
  });
});

app.delete('/reservas/:id', (req, res) => {
    const { id } = req.params;
    console.log('ID da reserva a ser deletada:', id); 
    const deleteQuery = 'DELETE FROM reservas WHERE id = ?';

    connection.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Erro ao deletar reserva:', err);
        return res.status(500).json({ message: 'Erro ao deletar reserva' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }

      res.json({ message: 'Reserva excluída com sucesso!' });
    });
});