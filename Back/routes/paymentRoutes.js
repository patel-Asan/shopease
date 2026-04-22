const express = require("express");
const QRCode = require("qrcode");
const router = express.Router();

const UPI_ID = process.env.UPI_ID || "dummy@upi";

router.post("/generate-qr", async (req, res) => {
  try {
    const { amount, orderId, customerName, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Valid amount is required" 
      });
    }

    const formattedAmount = parseFloat(amount).toFixed(2);
    const orderReference = orderId || `ORD${Date.now()}`;
    const customerNote = note || "ShopEase Order";

    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=ShopEase&am=${formattedAmount}&cu=INR&tr=${orderReference}&tn=${encodeURIComponent(customerNote)}`;

    const qrImage = await QRCode.toDataURL(upiUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      },
      errorCorrectionLevel: "M"
    });

    res.json({
      status: "success",
      data: {
        qrCodeImage: qrImage,
        upiId: UPI_ID,
        amount: formattedAmount,
        orderId: orderReference,
        payUrl: upiUrl.replace("upi://", "https://"),
        expiresIn: 300
      }
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to generate QR code" 
    });
  }
});

router.get("/verify-upi", async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ 
        status: "error", 
        message: "Order ID is required" 
      });
    }

    res.json({
      status: "success",
      data: {
        orderId,
        paymentStatus: "pending",
        message: "Payment verification requires manual confirmation from admin"
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Verification check failed" 
    });
  }
});

router.get("/config", (req, res) => {
  res.json({
    status: "success",
    data: {
      upiId: UPI_ID,
      receiverName: "ShopEase",
      isActive: true
    }
  });
});

module.exports = router;