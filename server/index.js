import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";  


const mpConfig = new MercadoPagoConfig({
  accessToken: "APP_USR-8768017750633442-111121-e916b87c9eef457067550623a0039aeb-2093176682",
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Soy el server :)");
});


app.post("/create_preference", async (req, res) => {
  try {
    
    const quantity = Number(req.body.quantity);
    const price = Number(req.body.price);

    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Cantidad o precio inválido" });
    }

    const unitPrice = price / quantity;

    const preference = {
      items: [
        {
          title: req.body.title,
          quantity: quantity,
          unit_price: unitPrice,
          currency_id: "ARS",
        },
      ],
    
      back_urls: {
        success: "https://www.instagram.com/__accesorioslolo/",
        failure: "https://www.instagram.com/__accesorioslolo/",
        pending: "https://www.instagram.com/__accesorioslolo/",
      },
      auto_return: "approved",
    };

    const preferenceInstance = new Preference(mpConfig);
    const result = await preferenceInstance.create({ body: preference });

    res.json({
      id: result.id,
    });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({ error: "Error al crear la preferencia :(" });
  }
});

app.post("/update_preference", async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    const price = Number(req.body.price);

    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Cantidad o precio inválido" });
    }

    const unitPrice = price / quantity;

    const preference = {
      items: [
        {
          title: req.body.title,
          quantity: quantity,
          unit_price: unitPrice,
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://www.instagram.com/__accesorioslolo/",
        failure: "https://www.instagram.com/__accesorioslolo/",
        pending: "https://www.instagram.com/__accesorioslolo/",
      },
      auto_return: "approved",
    };

    const preferenceInstance = new Preference(mpConfig);
    const result = await preferenceInstance.create({ body: preference });

    res.json({
      id: result.id,
    });
  } catch (error) {
    console.error("Error al actualizar la preferencia:", error);
    res.status(500).json({ error: "Error al actualizar la preferencia :(" });
  }
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
