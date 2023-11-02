const Stripe = require("stripe");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase-config");
const stripe = Stripe(process.env.STRIPE_KEY);

exports.checkout = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken || !decodedToken.uid) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    const uid = decodedToken.uid;

    const line_items = cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.authors?.join(", "),
            metadata: {
              id: item.id,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      shipping_options: [
        {
          shipping_rate: "shr_1Nf7qsJSfIR7qFgWVbblQPAG",
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    await db.collection("users").doc(uid).update({ cart: [] });

    res.cookie("payment_session", session.id, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create checkout session" });
  }
};
