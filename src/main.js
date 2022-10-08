import pizzaJson from './pizzas';

// variaveis globais
let modalKey = 0;
let quantityPizzas = 1;
let cart = [];

const select = (element) => document.querySelector(element);
const selectAll = (element) => document.querySelectorAll(element);

const realFormatter = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const moneyFormatter = (value) => {
  if (velue) {
    return value.toFixed(2);
  }
};

const openModal = () => {
  select('.pizza-window-area').style.opacity = 0;
  select('.pizza-window-area').style.display = 'flex';
  setTimeout(() => (select('.pizza-window-area').style.opacity = 1), 150);
};

const closeModal = () => {
  select('.pizza-window-area').style.opacity = 0;
  setTimeout(() => (select('.pizza-window-area').style.display = 'none'), 500);
};

const closeButtons = () => {
  selectAll('.pizza-info--cancel-btn, .pizza-info--cancel-mobile-btn').forEach(
    (item) => item.addEventListener('click', closeModal)
  );
};

const fillPizzaData = (pizzaItem, item, index) => {
  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = realFormatter(
    item.price[2]
  );
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--description').innerHTML =
    item.description;
};

const fillModalData = (item) => {
  select('.pizza-info h1').innerHTML = item.name;
  select('.pizza-big img').src = item.img;
  select('.pizza-info--desc').innerHTML = item.description;
  select('.pizza-info--actual-price').innerHTML = realFormatter(item.price[2]);
};

const getKey = (event) => {
  let key = event.target.closest('.pizza-item').getAttribute('data-key');

  // inicia com 1 pizza
  quantityPizzas = 1;

  // mantem a informação de qual pizza foi clicada
  modalKey = key;
  return key;
};

const setSizes = (key) => {
  select('.pizza-info--size.selected').classList.remove('selected');

  selectAll('.pizza-info--size').forEach((size, sizeIndex) => {
    sizeIndex == 2 ? size.classList.add('selected') : '';
    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
  });
};

const choosePizzaSize = (key) => {
  selectAll('.pizza-info--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
      select('.pizza-info--size.selected').classList.remove('selected');
      size.classList.add('selected');
      select('.pizza-info-actual-price').innerHTML = realFormatter(
        pizzaJson[key].price[sizeIndex]
      );
    });
  });
};

const changeQuantity = () => {
  select('.pizza-info--add').addEventListener('click', () => {
    quantityPizzas++;
    select('.pizza-info--qt').innerHTML = quantityPizzas;
  });

  select('.pizza-info--remove').addEventListener('click', () => {
    if (quantityPizzas > 1) {
      quantityPizzas--;
      select('.pizza-info--qt').innerHTML = quantityPizzas;
    }
  });
};

const addOnCart = () => {
  select('.pizza-info--add-btn').addEventListener('click', () => {
    // pegar dados da janela modal atual
    // tamanho
    let size = select('.pizza-info--size.selected').getAttribute('data-key');
    let price = select('.pizza-info--actual-price').innerHTML.replace(
      'R$&nbsp;',
      ''
    );

    // crie um identificador que junte id e tamanho
    let identifier = pizzaJson[modalKey].id + 't' + size;

    // antes de adicionar verifique se ja tem aquele codigo e tamanho
    // para adicionarmos a quantidade
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
      // se encontrar aumente a quantidade
      cart[key].qt += quantityPizzas;
    } else {
      // adicionar objeto pizza no carrinho
      let pizza = {
        identifier,
        id: pizzaJson[modalKey].id,
        size, // size: size
        qt: quantityPizzas,
        price: parseFloat(price), // price: price
      };
      cart.push(pizza);
    }
    closeModal();
    openCart();
    updateCart();
  });
};

const openCart = () => {
  if (cart.length > 0) {
    // mostrar o carrinho
    select('aside').classList.add('show');
    select('main').style.width = '70vw';
    select('header').style.display = 'flex'; // mostrar barra superior
  }

  // exibir aside do carrinho no modo mobile
  select('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
      select('aside').classList.add('show');
      select('aside').style.left = '0';
    }
  });
};

const closeCart = () => {
  // fechar o carrinho com o botão X no modo mobile
  select('.menu-closer').addEventListener('click', () => {
    select('aside').style.left = '100vw'; // usando 100vw ele ficara fora da tela
    select('main').style.width = '100vw';
    select('header').style.display = 'flex';
  });
};

const updateCart = () => {
  // exibir número de itens no carrinho
  select('.menu-openner span').innerHTML = cart.length;

  // mostrar ou nao o carrinho
  if (cart.length > 0) {
    // mostrar o carrinho
    select('aside').classList.add('show');

    // zerar meu .cart para nao fazer insercoes duplicadas
    select('.cart').innerHTML = '';

    // crie as variaveis antes do loop
    let subtotal = 0;
    let descount = 0;
    let total = 0;

    // para preencher os itens do carrinho, calcular subtotal
    for (let i in cart) {
      // use o find para pegar o item por id
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      // em cada item pegar o subtotal
      subtotal += cart[i].price * cart[i].qt;
      //console.log(cart[i].price)

      // fazer o clone, exibir na telas e depois preencher as informacoes
      let cartItem = select('.models .cart-item').cloneNode(true);
      select('.cart').append(cartItem);

      let pizzaSizeName = cart[i].size;

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      // preencher as informacoes
      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart-item--name').innerHTML = pizzaName;
      cartItem.querySelector('.cart-item--quant').innerHTML = cart[i].qt;
      cartItem.style.display = 'flex';
      // selecionar botoes + e -
      cartItem
        .querySelector('.cart-item--add')
        .addEventListener('click', () => {
          // adicionar apenas a quantidade que esta neste contexto
          cart[i].qt++;
          // atualizar a quantidade
          updateCart();
        });

      cartItem
        .querySelector('.cart-item--remove')
        .addEventListener('click', () => {
          if (cart[i].qt > 1) {
            // subtrair apenas a quantidade que esta neste contexto
            cart[i].qt--;
          } else {
            // remover se for zero
            cart.splice(i, 1);
          }

          cart.length < 1 ? (select('.cart-item').style.display = 'none') : '';

          // atualizar a quantidade
          updateCart();
        });

      select('.cart').append(cartItem);
    } // fim do for

    // fora do for
    // calcule desconto 10% e total
    //desconto = subtotal * 0.1
    descount = subtotal * 0;
    total = subtotal - descount;

    // exibir na tela os resultados
    // selecionar o ultimo span do elemento
    select('.subtotal span:last-child').innerHTML = realFormatter(subtotal);
    select('.descount span:last-child').innerHTML = realFormatter(descount);
    select('.total span:last-child').innerHTML = realFormatter(total);
  } else {
    // ocultar o carrinho
    select('aside').classList.remove('show');
    select('main').style.width = '100vw';
    select('aside').style.left = '100vw';
  }
};

const finishBuy = () => {
  select('.cart-finish').addEventListener('click', () => {
    select('aside').classList.remove('show');
    select('main').style.width = '100vw';
    select('aside').style.left = '100vw';
  });
};

pizzaJson.map((item, index) => {
  // selecionar template do item pizza
  let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

  select('.pizza-area').append(pizzaItem);

  //preencher os dados de cada pizza
  fillPizzaData(pizzaItem, item, index);

  // se clicarem na pizza
  pizzaItem
    .querySelector('.pizza-item a')
    .addEventListener('click', (event) => {
      event.preventDefault();

      let key = getKey(event);

      // abrir janela modal
      openModal();

      //prencher dados no modal
      fillModalData(item);

      //pegar tamanho selecionado
      setSizes(key);

      // define quantidade inicial como 1
      select('.pizza-info--qt').innerHTML = quantityPizzas;

      // seleciona o tamanho e preço clicado
      choosePizzaSize(key);
    });

  closeButtons();
});

changeQuantity();
openCart();
addOnCart();
updateCart();
closeCart();
finishBuy();
