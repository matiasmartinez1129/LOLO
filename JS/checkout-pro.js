const mp = new MercadoPago("APP_USR-efa07dd4-dde8-47c7-8da7-49797d34f73d", {
  locale: "es-AR",
});

let walletContainerCreated = false;  


document.getElementById("quantity").addEventListener("input", updateTotalPrice);

function updateTotalPrice() {
  const quantity = parseInt(document.getElementById("quantity").value); 
  const unitPrice = parseFloat(document.querySelector(".price").dataset.price);

 
  if (isNaN(quantity) || quantity <= 0) {
   
    document.getElementById("total-price").innerText = `$${unitPrice}`;
    return; 
  }


  const total_Price = unitPrice * quantity;


  document.getElementById("total-price").innerText = `$${total_Price}`;


  if (walletContainerCreated) {
    updateCheckoutPreference(quantity, total_Price); 
  }
}

function updateCheckoutPreference(quantity, totalPrice) {
  const orderData = {
    title: document.querySelector(".name-product").innerText,
    quantity: quantity,
    price: totalPrice,
  };


  fetch("http://localhost:3000/update_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
    
      if (data.id) {
        if (walletContainerCreated) {
          createCheckoutButton(data.id);
        }
      }
    })
    .catch((error) => {
      console.error("Error al actualizar la preferencia:", error);
    });
}


const createCheckoutButton = (preferenceId) => {
  const bricksBuilder = mp.bricks();

  const renderComponent = async () => {
   
    if (!walletContainerCreated) {
      
      const walletContainer = document.createElement("div");
      walletContainer.id = "wallet_container";
      document.body.appendChild(walletContainer); 
      walletContainerCreated = true; 
    }

    if (window.checkoutButton) {
      window.checkoutButton.unmount();  
    }

    
    window.checkoutButton = await bricksBuilder.create("wallet", "wallet_container", {
      initialization: {
        preferenceId: preferenceId,
        redirectMode: "modal",  
      },
      onClose: () => {
        console.log("Modal de Mercado Pago cerrado sin completar la compra");
        
        setTimeout(() => {
          const walletContainer = document.getElementById("wallet_container");
          if (walletContainer) {
            walletContainer.remove();  
            walletContainerCreated = false;  
          }
        }, 500); 
      }
    });
  };

  renderComponent();
};


document.getElementById("checkout-btn").addEventListener("click", async () => {
  try {
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    const unitPrice = parseFloat(document.querySelector(".price").dataset.price);
    const totalPrice = unitPrice * quantity;

    if (quantity <= 0 || isNaN(quantity)) {
      alert("Por favor, selecciona una cantidad válida.");
      return; 
    }

    const orderData = {
      title: document.querySelector(".name-product").innerText,
      quantity: quantity,
      price: totalPrice,  
    };

    const response = await fetch("http://localhost:3000/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const preference = await response.json();
    createCheckoutButton(preference.id); 
  } catch (error) {
    alert("Error al crear la preferencia de pago");
    console.error(error);
  }
});
