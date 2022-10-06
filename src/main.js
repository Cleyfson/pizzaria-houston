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
