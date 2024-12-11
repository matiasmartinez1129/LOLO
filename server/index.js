import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { MercadoPagoConfig, Preference } from 'mercadopago';


const mpConfig = new MercadoPagoConfig({
  accessToken: 'APP_USR-8768017750633442-111121-e916b87c9eef457067550623a0039aeb-2093176682',
});

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'matiasmartinez.web@gmail.com', 
    pass: 'arkfvemusczwlpvq', 
  },
  tls: {
    rejectUnauthorized: false, 
  },
});


app.get('/', (req, res) => {
  res.send('Soy el server :)');
});


app.post('/enviar-formulario', async (req, res) => {
  try {
    const { fullname, phone, city, address, postalcode, email } = req.body;

    
    if (!fullname || !phone || !city || !address || !postalcode || !email) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios en el formulario' });
    }

    const mailOptions = {
      from: email, 
      to: 'matiasmartinez.web@gmail.com', 
      subject: 'NUEVA COMPRA EN LOLÓ',
      text: `
        Nombre y Apellido: ${fullname}
        Teléfono: ${phone}
        Ciudad: ${city}
        Dirección: ${address}
        Código Postal: ${postalcode}
        Correo Electrónico: ${email}
      `,
    };

    
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    res.status(200).json({ success: true, message: 'Formulario enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});


app.post('/create_preference', async (req, res) => {
  try {
    const { quantity, price, title, applyDiscount } = req.body;

    
    if (!quantity || !price || !title) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Cantidad o precio inválido' });
    }

    
    const discount = applyDiscount ? price * 0.1 : 0;
    const totalPriceWithDiscount = price - discount;
    const unitPrice = totalPriceWithDiscount / quantity;

    const preference = {
      items: [
        {
          title: title,
          quantity: quantity,
          unit_price: parseFloat(unitPrice.toFixed(2)), 
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: 'https://www.instagram.com/__accesorioslolo/',
        failure: 'https://www.instagram.com/__accesorioslolo/',
        pending: 'https://www.instagram.com/__accesorioslolo/',
      },
      auto_return: 'approved',
    };

    const preferenceInstance = new Preference(mpConfig);
    const result = await preferenceInstance.create({ body: preference });

    res.json({
      id: result.id,
    });
  } catch (error) {
    console.error('Error al crear la preferencia:', error.message);
    res.status(500).json({ error: 'Error al crear la preferencia :(' });
  }
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
