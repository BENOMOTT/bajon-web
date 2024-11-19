function loadOrders() {
    const ordersContainer = document.getElementById('ordersContainer');
    const savedOrders = JSON.parse(localStorage.getItem('orders'));

    ordersContainer.innerHTML = '';

    if (savedOrders && savedOrders.length > 0) {
        savedOrders.forEach((savedOrder, index) => {
            const card = document.createElement('div');
            card.classList.add('card', 'mb-2');
            const orderId = savedOrder.id;

            if (!savedOrder.startTime) {
                savedOrder.startTime = Date.now();
                saveOrdersToLocalStorage(savedOrders);
            }
            const timeElementId = `time-${savedOrder.id}`;

            // Crear la tarjeta de cada pedido
            card.innerHTML = `
                <div class="card-body">
                    <h5>Pedido #${index + 1} - Departamento: ${savedOrder.department}</h5>
                    <h6>Productos:</h6>
                    <ul>
                        ${savedOrder.products.map(product => {
                            return `
                                <li>
                                    <strong>${product.name}</strong> - $${product.price} 
                                    <ul>
                                        ${product.ketchup ? '<li>Ketchup</li>' : ''}
                                        ${product.mustard ? '<li>Mostaza</li>' : ''}
                                        ${product.mayo ? '<li>Mayonesa</li>' : ''}
                                    </ul>
                                    ${product.note ? `<p><strong>Nota:</strong> ${product.note}</p>` : ''}
                                </li>
                            `;
                        }).join('')}
                    </ul>
                    <p><strong>Total: $${savedOrder.products.reduce((total, product) => total + product.price, 0)} CLP</strong></p>
                    <p><strong>Nota del Pedido: </strong>${savedOrder.note}</p> <!-- Nota del pedido aquí -->
                    <p><strong>Tiempo transcurrido: <span id="${timeElementId}">00:00</span></strong></p>
                    <button class="btn btn-danger" onclick="confirmFinishOrder(${orderId})">Terminar Pedido</button>
                </div>
            `;

            ordersContainer.appendChild(card);

            const timeElement = document.getElementById(timeElementId);
            updateElapsedTime(timeElement, savedOrder.startTime);
        });
    } else {
        ordersContainer.innerHTML = '<h1>Aún no piden nada :c</h1>';
    }
}


function confirmFinishOrder(orderId) {
    if (confirm("¿Seguro que quieres terminar este pedido?")) {
        finishOrder(orderId);
    }
}

function finishOrder(orderId) {
    let savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    savedOrders = savedOrders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(savedOrders));
    loadOrders();
}

function saveOrdersToLocalStorage(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function updateElapsedTime(timeElement, startTime) {
    setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', loadOrders);
