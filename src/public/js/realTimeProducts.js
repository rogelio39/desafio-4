const socket = io();

const form = document.getElementById('idForm');
const btnProducts = document.getElementById('btnProducts');
const showProducts = document.getElementById('showProducts');

const products = [];


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
    const prod = Object.fromEntries(dataForm);
    socket.emit('nuevoProducto', prod);
    e.target.reset();
}
)


socket.on('prods', productos => {

    if (productos.length === 0) {
        showProducts.innerHTML = '<p>No hay productos para mostrar</p>'
    } else {
        let productsHTML = ''; // Variable para almacenar el contenido HTML de todos los productos
        productos.forEach(prod => {
            // Concatenar el contenido de cada producto en productsHTML
            productsHTML += `
                <div class="products">
                    <p>Nombre:${prod.title}</p>
                    <p>Descripcion:${prod.description}</p>
                    <p>Precio:${prod.price}</p>
                    <p>Stock disponible:${prod.stock}</p>
                    <p>Codigo del producto:${prod.code}</p>
                    </div>`;
        });
        // Asignar el contenido acumulado a showProducts.innerHTML
        showProducts.innerHTML = productsHTML;
    }
})



socket.on('prod', (productos) => {
    let productsHTML = ''; // Variable para almacenar el contenido HTML de todos los productos
    productos.forEach(prod => {
        // Concatenar el contenido de cada producto en productsHTML
        productsHTML += `
        <div class="products">
            <p>Nombre:${prod.title}</p>
            <p>Descripcion:${prod.description}</p>
            <p>Precio:${prod.price}</p>
            <p>Stock disponible:${prod.stock}</p>
            <p>Codigo del producto:${prod.code}</p>
            </div>`;
    });
    // Asignar el contenido acumulado a showProducts.innerHTML
    showProducts.innerHTML = productsHTML;
});



btnProducts.addEventListener('click', () => {
    if (showProducts.classList.contains('off')) {
        showProducts.classList.remove('off');
        showProducts.classList.add('on');
        btnProducts.textContent = 'Ocultar Productos'
    } else {
        showProducts.classList.remove('on');
        showProducts.classList.add('off');
        btnProducts.textContent = 'Mostrar productos'
    }
})