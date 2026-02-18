import axios from "axios";
import orderModel from "../../models/order.model.js";

const baseURL = "https://sandbox.safaricom.co.ke";

const mpesaService = {

  async generateAccessToken() {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const response = await axios.get(
      `${baseURL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    return response.data.access_token;
  },

  async initiateSTK({ orderId, userId, phone }) {
    const order = await orderModel.findById(orderId);

    if (!order) throw new Error("Order not found");
    if (order.user_id !== userId) throw new Error("Unauthorized");
    if (order.status === "paid") throw new Error("Order already paid");

    const accessToken = await this.generateAccessToken();

    const timestamp = getTimestamp();

    const password = Buffer.from(
      process.env.MPESA_SHORTCODE +
      process.env.MPESA_PASSKEY +
      timestamp
    ).toString("base64");

    const response = await axios.post(
      `${baseURL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(order.total_amount)),
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `Order-${orderId}`,
        TransactionDesc: "Order Payment"
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }
};

function getTimestamp() {
  const date = new Date();

  return (
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0")
  );
}

export default mpesaService;
