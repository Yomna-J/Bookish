const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_KEY);

exports.verifyPayment = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.payment_session) return res.sendStatus(204);
  const session_id = cookies.payment_session;

  try {
    const paymentSession = await stripe.checkout.sessions.retrieve(session_id);

    if (paymentSession.payment_status === "paid") {
      res.clearCookie("payment_session", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.error("Error retrieving payment session:", error);
    res.status(500).json({ error: "Error retrieving payment session" });
  }
};
