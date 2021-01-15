// Object property shorthand
const name = 'Doug'
const userAge = 27

const user = {
  name,
  age: userAge,
  location: 'Bellingham'
}


// Object destructuring
const product =  {
  label: 'Yellow Book',
  price: 3,
  stock: 201,
  salePrice: undefined
}

const { label:productLabel, price, stock, salePrice, rating = 5 } = product;

const transaction = (type, { label, stock }) => {
  console.log(type, label, stock);
}

transaction('order', product);