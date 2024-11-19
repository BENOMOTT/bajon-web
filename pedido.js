let order = [];

// Función para agregar productos al pedido
function addProduct(name, price) {
    order.push({ name, price, ketchup: false, mustard: false, mayo: false });

    // Actualizar la vista del pedido
    updateProductCards();
}

// Función para actualizar las tarjetas de productos en el pedido
function updateProductCards() {
    const productCardsContainer = document.getElementById('productCardsContainer');
    const totalPriceElement = document.getElementById('totalPrice');
    
    // Limpiar el contenedor de productos
    productCardsContainer.innerHTML = '';
    
    // Mostrar los productos agregados al pedido
    order.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('card', 'mb-2');
        
        // Crear el HTML de la tarjeta del producto
        let productCardContent = `  
            <div class="card-body">
                <h5>${product.name}</h5>
                <p>$${product.price}</p>
        `;
        
        // Agregar opciones de salsa (Ketchup, Mostaza, Mayo) para todos los productos excepto las empanadas
        if (product.name !== "Napolitana" && product.name !== "Jamón queso" && product.name !== "Queso") {
            // Agregar ketchup
            productCardContent += ` 
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="ketchup-${index}" ${product.ketchup ? 'checked' : ''} onclick="toggleCheckbox(${index}, 'ketchup')">
                    <label class="form-check-label" for="ketchup-${index}">Ketchup</label>
                </div>
            `;
            
            // Agregar mostaza
            productCardContent += `
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="mustard-${index}" ${product.mustard ? 'checked' : ''} onclick="toggleCheckbox(${index}, 'mustard')">
                    <label class="form-check-label" for="mustard-${index}">Mostaza</label>
                </div>
            `;
            
            // Si el producto no es Italiano, agregar mayo
            if (product.name !== "Italiano") {
                productCardContent += `
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="mayo-${index}" ${product.mayo ? 'checked' : ''} onclick="toggleCheckbox(${index}, 'mayo')">
                        <label class="form-check-label" for="mayo-${index}">Mayonesa</label>
                    </div>
                `;
            }
        }

        // Botón de eliminar
        productCardContent += `
                <button class="btn btn-danger" onclick="removeProduct(${index})">Eliminar</button>
            </div>
        `;
        
        productCard.innerHTML = productCardContent;
        productCardsContainer.appendChild(productCard);
    });

    // Calcular el total
    const total = order.reduce((sum, product) => sum + product.price, 0);
    totalPriceElement.innerText = `Total: $${total} CLP`;
}

// Función para manejar la selección/deselección de los checkboxes
function toggleCheckbox(index, condiment) {
    const product = order[index];
    
    // Actualizar el estado del checkbox para cada producto
    product[condiment] = !product[condiment];
    
    // Actualizar la vista del pedido
    updateProductCards();
}

// Función para eliminar un producto del pedido
function removeProduct(index) {
    order.splice(index, 1); // Eliminar el producto
    updateProductCards(); // Actualizar la vista
}

function submitOrder() {
    if (order.length === 0) {
        alert("No has agregado productos al pedido.");
    } else {
        const departmentInput = document.getElementById('departmentInput').value.trim();
        const orderNote = document.getElementById('orderNote').value.trim();

        if (!departmentInput) {
            alert("Por favor, ingresa el departamento.");
            return;
        }

        // Obtener los pedidos existentes, si los hay
        let orders = JSON.parse(localStorage.getItem('orders')) || [];

        // Crear un nuevo objeto de pedido
        const newOrder = {
            id: Date.now(), // Usamos la hora actual como ID único
            department: departmentInput,
            products: order,
            note: orderNote, // Nota del pedido
            startTime: Date.now(),
        };

        // Agregar el nuevo pedido a la lista de pedidos
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Redirigir al index.html
        window.location.href = 'index.html';
    }
}
