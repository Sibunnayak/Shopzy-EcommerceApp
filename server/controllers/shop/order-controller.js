const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;
    // console.log(req.body);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      // redirect_urls: {
      //   return_url: "http://localhost:5173/shop/paypal-return",
      //   cancel_url: "http://localhost:5173/shop/paypal-cancel",
      // },
      redirect_urls: {
        return_url: "https://shopzy-ecommerce-app.vercel.app/shop/paypal-return",
        cancel_url: "https://shopzy-ecommerce-app.vercel.app/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();
        // Populate userId to get the email
        const populatedOrder = await Order.findById(
          newlyCreatedOrder._id
        ).populate("userId");
        // Send email notification for order confirmation
        const emailContent = `
    <h2 style="color: #1b03a3;">Hi ${populatedOrder.userId.userName},</h2>
    <p>Your order with ID <strong>${
      populatedOrder._id
    }</strong> has been received but is awaiting payment confirmation.</h3>
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
        ${populatedOrder.cartItems
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
          <td style="border: 1px solid #ddd; padding: 8px;">₹${populatedOrder.totalAmount.toFixed(
            2
          )}</td>
        </tr>
      </tbody>
    </table>
    <p style="color: #555;">Please complete the payment to confirm your order.</p>
    <p style="color: #555;">Thank you for shopping with us!</p>
    <p>Best regards,</p>
    <p>Team Shopzy</p>
    `;

        await sendEmail({
          to: populatedOrder.userId.email,
          subject: "Order Received - Pending Payment",
          html: emailContent,
        });

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: populatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId).populate("userId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();
    await sendEmail({
      to: order.userId.email,
      subject: "Order Confirmed",
      html: `
        <h2 style="color: #1b03a3;">Hi ${order.userId.userName},</h2>
        <p>Your order with ID <strong>${order._id}</strong> has been confirmed! We are processing it and will notify you once it is ready for the next steps. Thank you for choosing Shopzy. Please stay with us for updates.</p>
        <p>Payment Method: PayPal</p>
        <p>Payment ID: <strong>${paymentId}</strong></p>
        <p>Best regards,</p>
        <p>Team Shopzy</p>
      `,
    });
    res.status(200).json({
      success: true,
      message: "Order confirmed",
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

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

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

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
