const productList = document.querySelector('#products');

const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');

// Selectors for add
const addName = document.querySelector('#name');
const addDescription = document.querySelector('#description');
const addPrice = document.querySelector('#price');

// Selectors for update
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductDescription = document.querySelector('#update-description');
const updateProductPrice = document.querySelector('#update-price');

// ===============================
// Fetch all products
// ===============================
async function fetchProducts() {
  const response = await fetch('http://52.205.243.188:3000/products');
  const products = await response.json();

  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');

    li.innerHTML = `
      <span class="title">${product.name}</span>
      <span class="description">${product.description}</span>
      <span class="price">$${product.price}</span>
    `;

    // DELETE button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });

    // UPDATE button
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.classList.add('update-btn');
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductDescription.value = product.description;
      updateProductPrice.value = product.price;
    });

    li.appendChild(updateButton);
    li.appendChild(deleteButton);

    productList.appendChild(li);
  });
}

// ===============================
// ADD PRODUCT
// ===============================
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const name = addName.value;
  const description = addDescription.value;
  const price = addPrice.value;

  await addProduct(name, description, price);

  addProductForm.reset();
  await fetchProducts();
});

async function addProduct(name, description, price) {
  const response = await fetch('http://52.205.243.188:3000/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
  return response.json();
}

// ===============================
// UPDATE PRODUCT
// ===============================
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = updateProductId.value;
  const name = updateProductName.value;
  const description = updateProductDescription.value;
  const price = updateProductPrice.value;

  await updateProduct(id, name, description, price);

  updateProductForm.reset();
  await fetchProducts();
});

async function updateProduct(id, name, description, price) {
  const response = await fetch(`http://52.205.243.188:3000/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });

  return response.json();
}

// ===============================
// DELETE PRODUCT
// ===============================
async function deleteProduct(id) {
  const response = await fetch(`http://52.205.243.188:3000/products/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// ===============================
// SEARCH BY ID
// ===============================
const searchForm = document.querySelector('#search-form');
const searchId = document.querySelector('#search-id');
const searchResult = document.querySelector('#search-result');

async function fetchProductById(id) {
  const response = await fetch(`http://52.205.243.188:3000/products/${id}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = searchId.value;
  const data = await fetchProductById(id);

  // Como o retorno é um array, precisamos acessar data[0]
  if (!data || data.length === 0) {
    searchResult.innerHTML = `
      <div class="error">Produto não encontrado.</div>
    `;
    return;
  }

  const product = data[0];

  searchResult.innerHTML = `
    <div class="card result-card">
      <h3>${product.name}</h3>
      <p><strong>Description:</strong> ${product.description}</p>
      <p><strong>Price:</strong> $${product.price}</p>
    </div>
  `;
});

// ===============================
// INIT
// ===============================
fetchProducts();


