document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById("checkout-btn");
    const modalContainer = document.getElementById("modal-container");
    const walletContainer = document.getElementById("wallet_container");

    checkoutButton?.addEventListener("click", () => {
        modalContainer.innerHTML = `
            <div class="form-container">
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
            </div>
        `;
        modalContainer.classList.add("show");

        const form = document.getElementById("user-form");
        const inputs = form.querySelectorAll("input");
        const errorMessages = form.querySelectorAll(".error-message");

       
        const validators = {
            "user-fullname": (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) || "Por favor, ingresa un Nombre y Apellido válido.",
            "user-phone": (value) => /^\d+$/.test(value) || "Por favor, ingresa un Teléfono válido.",
            "user-city": (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) || "Por favor, ingresa una Ciudad válida.",
            "user-address": (value) => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(value) || "Por favor, ingresa un Domicilio válido.",
            "user-postalcode": (value) => /^\d+$/.test(value) || "Por favor, ingresa un Código Postal válido.",
            "user-email": (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Por favor, ingresa un Email válido.",
        };

        
        const validateField = (input) => {
            const errorMessage = validators[input.id](input.value.trim());
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

        
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!validateForm()) {
                alert("Por favor, corrige los errores antes de continuar.");
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
                    modalContainer.classList.remove("show");
                } else {
                    alert("Ocurrió un error al enviar el formulario.");
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                alert("Ocurrió un error al procesar el formulario.");
            }
        });
    });
});
