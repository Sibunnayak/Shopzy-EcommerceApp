const Order = require("../../models/Order");
const { sendEmail } = require("../../helpers/sendMail");
const Product = require("../../models/Product");
const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id).populate("userId"); // Populating user's email from userId

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Update stock if status is "rejected"
    if (orderStatus.toLowerCase() === "rejected") {
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);

        if (product) {
          // Increase stock back to inventory
          product.totalStock += item.quantity;
          await product.save();
        } else {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.title} not found while rejecting the order.`,
          });
        }
      }
    }

    // Update order status
    await Order.findByIdAndUpdate(id, { orderStatus });

    // Reason for cancellation if the status is "canceled"
    let reasonForCancellation = "";
    if (orderStatus.toLowerCase() === "rejected") {
      reasonForCancellation =
        "Seller canceled the order because the stock is not available.";
    }

    // Sending email
    const subjectMap = {
      inProcess: "Your order is now being processed",
      inShipping: "Your order is on the way",
      delivered: "Your order has been delivered",
      rejected: "Order Canceled and Refund Initiated",
    };

    const subject = subjectMap[orderStatus.toLowerCase()] || "Order Update";

    await sendEmail({
      to: order.userId.email,
      subject,
      html: `
        <h2 style="color: #1b03a3;">Hi ${order.userId.userName},</h2>
        <p>Your order with ID <strong>${
          order._id
        }</strong> has been updated to: <strong>${orderStatus}</strong>.</p>
        
        ${
          orderStatus.toLowerCase() === "rejected"
            ? `<p>Reason for cancellation: ${reasonForCancellation}</p>
               <p>The payment for this order will be refunded within 7 working days.</p>`
            : ""
        }
        
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">S No.</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product Name</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.cartItems
              .map(
                (item, index) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    index + 1
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.title
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.quantity
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">₹${
                    isNaN(Number(item.price))
                      ? item.price
                      : Number(item.price).toFixed(2)
                  }</td>
                </tr>
              `
              )
              .join("")}
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Total:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">₹${order.totalAmount.toFixed(
                2
              )}</td>
            </tr>
          </tbody>
        </table>
        
        <p style="color: #555;">Thank you for shopping with us!</p>
        <p>Best regards,</p>
        <p>Team Shopzy</p>
      `,
    });

    res.status(200).json({
      success: true,
      message:
        "Order status updated, stock adjusted, and email sent successfully!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the order!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
