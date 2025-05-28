
 let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];


 const carrinhoContainer = document.getElementById('carrinho');
 let total = 0;

 carrinho.forEach(produto => {

     let produtoDiv = document.createElement('div');
     produtoDiv.classList.add('produto');
     produtoDiv.innerHTML = `
         <div class="info">
             <h3>${produto.nome}</h3>
             <p>R$ ${produto.preco.toFixed(2)}</p>
         </div>
         <button class="remove-btn" onclick="removerProduto(${produto.preco})">Remover</button>
     `;
     carrinhoContainer.appendChild(produtoDiv);


     total += produto.preco;
 });


 let totalDiv = document.createElement('div');
 totalDiv.classList.add('total');
 totalDiv.innerHTML = `<p><strong>Total:</strong> R$ <span id="totalValue">${total.toFixed(2)}</span></p><button class="finalizar-btn">Finalizar Compra</button>`;
 carrinhoContainer.appendChild(totalDiv);


 function removerProduto(preco) {
     carrinho = carrinho.filter(produto => produto.preco !== preco);
     localStorage.setItem('carrinho', JSON.stringify(carrinho));
     window.location.reload();
 }

 async function carregarCarrinho() {
    const resposta = await fetch('BACKEND/carrinho_data.php');
    const produtos = await resposta.json();

    const carrinhoContainer = document.getElementById('carrinhoContainer');
    let total = 0;


    carrinhoContainer.querySelectorAll('.produto').forEach(e => e.remove());

    produtos.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        const div = document.createElement('div');
        div.classList.add('produto');
        div.setAttribute('data-id', produto.id);

        div.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="info">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2)} x ${produto.quantidade}</p>
            </div>
            <button class="remove-btn" onclick="removerProduto(${produto.id})">Remover</button>
        `;

        carrinhoContainer.insertBefore(div, carrinhoContainer.querySelector('.total'));
    });

    document.getElementById('totalValue').textContent = total.toFixed(2);
}

async function removerProduto(produtoId) {
    await fetch('BACKEND/remover_produto.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `produto_id=${produtoId}`
    });

    carregarCarrinho();
}

window.onload = carregarCarrinho;
