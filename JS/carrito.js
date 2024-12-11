const cartCount = document.querySelector(".cart-count");
const addToCartButton = document.querySelector(".carrito");
const quantityInput = document.querySelector("#quantity");
const priceElement = document.querySelector("#total-price");
const firstImage = document.querySelector(".product-image");
const firstProductName = document.querySelector(".name-product")?.textContent;
const firstProductId = document.querySelector(".name-product")?.getAttribute("data-id");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


const saveLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};


const carritoCounter = () => {
    const carritoLength = carrito.length;
    localStorage.setItem("carritoCounter", JSON.stringify(carritoLength));

    if (cartCount) {
        cartCount.innerText = carritoLength;
    }
};


carritoCounter();

const agregarAlCarrito = () => {
    const quantity = parseInt(quantityInput.value) || 1;
    const price = parseFloat(priceElement.dataset.price);
    const productId = firstProductId;
    const productName = firstProductName;
    const productImage = firstImage.src;

    const existingProduct = carrito.find((item) => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        carrito.push({
            id: productId,
            name: productName,
            image: productImage,
            price: price,
            quantity: quantity,
        });
    }

    saveLocal();
    carritoCounter();
};

if (addToCartButton) {
    addToCartButton.addEventListener("click", agregarAlCarrito);
}


const obtenerPreferenceId = async (totalSinDescuento) => {
    const aplicaDescuento = totalSinDescuento >= 50000;

    const response = await fetch("http://localhost:3000/create_preference", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            quantity: carrito.reduce((acc, item) => acc + item.quantity, 0),
            price: totalSinDescuento,
            title: "Mi Carrito",
            applyDiscount: aplicaDescuento,
        }),
    });

    const data = await response.json();
    return data.id;
};


const renderCarrito = () => {
    if (!modalContainer) return;

    modalContainer.innerHTML = "";
    modalContainer.classList.add("show");

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `<h3 class="modal-header-title">Mi Carrito</h3>`;
    modalContainer.append(modalHeader);

    const modalButton = document.createElement("i");
    modalButton.innerHTML = `<i class="fa-solid fa-x"></i>`;
    modalButton.className = "modal-header-button";
    modalHeader.append(modalButton);

    modalButton.addEventListener("click", () => {
        modalContainer.innerHTML = "";
        modalContainer.classList.remove("show");
    });

    carrito.forEach((product) => {
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.setAttribute("data-id", product.id);

        modalContent.innerHTML = `
            <img class="modal-image" src="${product.image}" alt="${product.name}">
            <h3 class="modal-name">${product.name}</h3>
            <p class="modal-price">Precio: $${product.price.toFixed(2)}</p>
            <span class="restar">-</span>
            <p class="modal-quantity">Cantidad: ${product.quantity}</p>
            <span class="sumar">+</span>
            <p class="modal-subtotal">Subtotal: $${(product.price * product.quantity).toFixed(2)}</p>
        `;

        const restarButton = modalContent.querySelector(".restar");
        restarButton.addEventListener("click", () => {
            if (product.quantity > 1) {
                product.quantity--;
                saveLocal();
                carritoCounter();
                renderCarrito();
            }
        });

        const sumarButton = modalContent.querySelector(".sumar");
        sumarButton.addEventListener("click", () => {
            product.quantity++;
            saveLocal();
            carritoCounter();
            renderCarrito();
        });

        const clearButton = document.createElement("i");
        clearButton.className = "fa-solid fa-trash";
        clearButton.style.cursor = "pointer";
        clearButton.style.color = "red";
        clearButton.style.marginLeft = "10px";

        clearButton.addEventListener("click", () => {
            carrito = carrito.filter((item) => item.id !== product.id);
            carritoCounter();
            saveLocal();
            renderCarrito();
        });

        modalContent.append(clearButton);
        modalContainer.append(modalContent);
    });

    const total = carrito.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const totalBuy = document.createElement("div");
    totalBuy.className = "total-content";
    totalBuy.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    modalContainer.append(totalBuy);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "modal-footer";
    modalContainer.append(buttonContainer);

    const payButton = document.createElement("button");
    payButton.className = "btn-pay";
    payButton.innerText = "Ir a Pagar";
    buttonContainer.append(payButton);

    const formContainer = document.createElement("div");
formContainer.id = "form-container";
formContainer.style.display = "none";
formContainer.innerHTML = `
    <form id="user-form" novalidate>
        <label for="user-fullname">Nombre y Apellido:</label>
        <input type="text" id="user-fullname" placeholder="Tu nombre y apellido" required>
        <span class="error-message"></span>
        
        <label for="user-phone">Número de Teléfono:</label>
        <input type="tel" id="user-phone" placeholder="Tu número de teléfono" required>
        <span class="error-message"></span>
        
        <label for="user-city">Ciudad:</label>
        <input type="text" id="user-city" placeholder="Tu ciudad" required>
        <span class="error-message"></span>
        
        <label for="user-address">Domicilio:</label>
        <input type="text" id="user-address" placeholder="Tu domicilio" required>
        <span class="error-message"></span>
        
        <label for="user-postalcode">Código Postal:</label>
        <input type="text" id="user-postalcode" placeholder="Tu código postal" required>
        <span class="error-message"></span>
        
        <label for="user-email">Correo Electrónico:</label>
        <input type="email" id="user-email" placeholder="Tu correo electrónico" required>
        <span class="error-message"></span>
        
        <button type="submit" class="btn-submit">Continuar con el pago</button>
    </form>
`;

buttonContainer.append(formContainer);

const walletContainer = document.createElement("div");
walletContainer.id = "wallet-container";
walletContainer.style.display = "none";
buttonContainer.append(walletContainer);

payButton.addEventListener("click", () => {
    payButton.style.display = "none";
    formContainer.style.display = "block";
});

const form = formContainer.querySelector("#user-form");
const inputs = form.querySelectorAll("input");
const errorMessages = form.querySelectorAll(".error-message");


const validators = {
    fullname: (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) || "Por favor, ingresa un Nombre y Apellido válido.",
    phone: (value) => /^\d+$/.test(value) || "Por favor, ingresa un Teléfono válido.",
    city: (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) || "Por favor, ingresa una Ciudad válida.",
    address: (value) => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(value) || "Por favor, ingresa un Domicilio válido.",
    postalcode: (value) => /^\d+$/.test(value) || "Por favor, ingresa un Código Postal válido.",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Por favor, ingresa un Email válido.",
};


const validateField = (input) => {
    const fieldName = input.id.replace("user-", "");
    const errorMessage = validators[fieldName](input.value.trim());
    const errorElement = input.nextElementSibling;

    if (typeof errorMessage === "string") {
        errorElement.textContent = errorMessage;
        input.classList.add("invalid");
        return false;
    } else {
        errorElement.textContent = "";
        input.classList.remove("invalid");
        return true;
    }
};


const validateForm = () => {
    let isValid = true;
    inputs.forEach((input) => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    return isValid;
};


inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        alert("Por favor, completa correctamente todos los campos.");
        return;
    }

    
    const formData = Array.from(inputs).reduce((acc, input) => {
        acc[input.id.replace("user-", "")] = input.value.trim();
        return acc;
    }, {});

    try {
        const response = await fetch("http://localhost:3000/enviar-formulario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (result.success) {
            alert("Formulario enviado con éxito.");
            form.reset();
            formContainer.style.display = "none";
            walletContainer.style.display = "block";

            const total = carrito.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const preferenceId = await obtenerPreferenceId(total);

            const mp = new MercadoPago("TU_PUBLIC_KEY", { locale: "es-AR" });
            mp.checkout({
                preference: { id: preferenceId },
                render: { container: "#wallet-container", label: "Pagar con Mercado Pago" },
            });
        } else {
            alert("Error al enviar formulario.");
        }
    } catch (error) {
        console.error(error);
        alert("Hubo un error al enviar el formulario.");
    }
});
};

verCarrito?.addEventListener("click", renderCarrito);
