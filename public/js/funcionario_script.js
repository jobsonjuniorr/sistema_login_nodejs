let order = [];

function addToOrder(button) {
    const productElement = button.closest('.product');
    const productName = productElement.getAttribute('data-name');
    const productPrice = parseFloat(productElement.getAttribute('data-price'));

    order.push({ name: productName, price: productPrice });
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    orderSummary.innerHTML = '';

    let productCount = {};
    order.forEach(item => {
        if (productCount[item.name]) {
            productCount[item.name].count++;
        } else {
            productCount[item.name] = { count: 1, price: item.price };
        }
    });

    for (let product in productCount) {
        let listItem = document.createElement('li');
        listItem.textContent = `${product}: ${productCount[product].count} x R$ ${productCount[product].price.toFixed(2)}`;
        orderSummary.appendChild(listItem);
    }
}
function limparOrder() {
    order = [];
    mesa = document.getElementById('mesa').value = '';
    cliente = document.getElementById('nome_cliente').value = '';
    updateOrderSummary();
    alert('Pedido foi limpo com sucesso!');
}

function sendOrderToWhatsApp(orderDetails) {

    const me = orderDetails.mesa;
    const nome = orderDetails.cliente;
    let message = `Nome do cliente: ${nome}\n\nMesa ${me}\nPedidos realizado:\n`;

    for (const item in orderDetails.items) {
        const quantily = orderDetails.items[item].count;
        const preco = orderDetails.items[item].price;
        message += `${item} x ${quantily} - R$ ${preco} \n`
    }
    message += `\n Valor total: R$ ${orderDetails.totalAmount}\n`

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '+5599999999999';//substituir pelo número que deseja enviar a mensagem 

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
    window.open(whatsappUrl, '_blank');
}


function submitOrder() {
    var mesa = document.getElementById('mesa').value;
    var cliente = document.getElementById('nome_cliente').value;

    if (order.length === 0) {
        alert('O pedido está vazio. Adicione itens ao seu pedido antes de enviá-lo.');
        return;
    }
    if (!mesa) {
        alert('Por favor, informe o número da mesa.');
        return;
    }
    if (!cliente) {
        alert('Por favor, informe o seu nome para o atendimento.');
        return;
    }

    let groupedOrder = {};
    let totalAmount = 0;

    order.forEach(item => {
        if (groupedOrder[item.name]) {
            groupedOrder[item.name].count++;
        } else {
            groupedOrder[item.name] = { count: 1, price: item.price };
        }
        totalAmount += item.price;
    });


    const orderDetails = {
        items: groupedOrder,
        totalAmount: totalAmount.toFixed(2),
        mesa: mesa,
        cliente: cliente
    };

    fetch('http://localhost:3000/submit-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
    }).then(response => {
       
        if (response.ok) {
            alert(`Pedido enviado com sucesso! Valor total: R$${totalAmount.toFixed(2)}`);
            order = []; 
            updateOrderSummary();
        } else {
            alert('Erro ao enviar pedido.');
        }
    }).catch(error => {
        console.error('Erro ao enviar pedido:', error);
        alert('Erro ao enviar pedido.');
    });
    sendOrderToWhatsApp(orderDetails);
    limparOrder();
    
}

function limparReserva(){
    const mesaId = document.getElementById('mesa-id').value = '';
    const estadoSelect = document.getElementById('estado').value = '';
    const inicio = document.getElementById('inicio').value = '';
    const fim = document.getElementById('fim').value = '';
    const nomeCliente = document.getElementById('nome-cliente').value = '';
    const telefoneCliente = document.getElementById('telefone-cliente').value = '';
}

window.atualizarEstado = function() {
    const mesaId = document.getElementById('mesa-id').value;
    const estadoSelect = document.getElementById('estado');
    const novoEstado = estadoSelect.value;
    const inicio = document.getElementById('inicio').value;
    const fim = document.getElementById('fim').value;
    const nomeCliente = document.getElementById('nome-cliente').value;
    const telefoneCliente = document.getElementById('telefone-cliente').value;
  
    fetch(`/mesas/${mesaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        estado: novoEstado, 
        inicio, 
        fim,
        nome_cliente: nomeCliente,
        telefone_cliente: telefoneCliente
      })
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(error => console.error('Erro ao atualizar o estado da mesa:', error));
  }

function atualizarReservas() {
    fetch('/mesas/reservas')
      .then(response => response.json())
      .then(reservas => {
        for (let i = 1; i <= 5; i++) {
          const mesaReservas = reservas[i] || [];
          const mesaTd = document.getElementById(`mesa${i}`);
          mesaTd.innerHTML = ''; // Limpa as reservas anteriores
  
          mesaReservas.forEach(reserva => {
            const { id, inicio_formatado, fim_formatado, nome_cliente, telefone_cliente } = reserva;
  
            // Verifica se as datas estão definidas para evitar erros
            const dataReserva = inicio_formatado ? inicio_formatado.split(' ')[0] : 'Data não disponível';
            const horarioInicio = inicio_formatado ? inicio_formatado.split(' ')[1] : 'Horário não disponível';
            const horarioFim = fim_formatado ? fim_formatado.split(' ')[1] : 'Horário não disponível';
  
            const reservaText = `
              Data: ${dataReserva}<br>
              Horário: ${horarioInicio} até ${horarioFim}<br>
              Cliente: ${nome_cliente || 'N/A'}<br>
              Telefone: ${telefone_cliente || 'N/A'}
            `;
            
            const reservaDiv = document.createElement('div');
            reservaDiv.classList.toggle('resutaldoTabela')
            reservaDiv.innerHTML = reservaText;
  
            // Cria o botão de exclusão
            const excluirBtn = document.createElement('button');
            excluirBtn.classList.toggle('botao_excluir_tabela')
            excluirBtn.textContent = 'Excluir';
            excluirBtn.onclick = () => excluirReserva(id); // Função para excluir a reserva
            excluirBtn.onclick = () => {
                console.log('Excluindo reserva com ID:', id);
                excluirReserva(id);
              };
  
            // Adiciona o botão de exclusão ao lado da reserva
            reservaDiv.appendChild(excluirBtn);
            reservaDiv.style.marginBottom = '10px'; 
            mesaTd.appendChild(reservaDiv);
          });
        }
      })
      .catch(error => console.error('Erro ao buscar reservas:', error));
  }
  
  // Função para excluir a reserva
  function excluirReserva(idReserva) {
    if (confirm('Você tem certeza que deseja cancelar esta reserva?')) {
      fetch(`/reservas/${idReserva}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        atualizarReservas(); 
      })
      .catch(error => console.error('Erro ao excluir a reserva:', error));
    }
  }
  atualizarReservas();


