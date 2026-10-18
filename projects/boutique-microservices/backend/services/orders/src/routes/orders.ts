import express from 'express';
import axios from 'axios';
import { query } from '../database/connection';
import { Order, CreateOrderRequest, Address, ServiceResponse } from '../types';

const router = express.Router();
const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003';

router.post('/', async (req, res) => {
  try {
    // Demo mode - use a fixed user ID or get from request
    const { items, shippingAddress, userId = 'demo-user-id' } = req.body as CreateOrderRequest & { userId?: string };

    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const productResponse = await axios.get(`${PRODUCTS_SERVICE_URL}/${item.productId}`);
      const product = productResponse.data.data;

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product_id: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    const result = await query(`
      INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [userId, totalAmount, 'pending', JSON.stringify(shippingAddress), 'pending']);

    const order = result.rows[0];

    const insertedItems: any[] = [];
    for (const item of orderItems) {
      const itemResult = await query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [order.id, item.product_id, item.quantity, item.price]);
      insertedItems.push({ ...item, id: itemResult.rows[0].id });
    }

    const response: ServiceResponse<Order> = {
      success: true,
      data: {
        id: order.id,
        userId: order.user_id,
        items: insertedItems.map(item => ({
          id: item.id,
          orderId: order.id,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: order.total_amount,
        status: order.status,
        shippingAddress: shippingAddress,
        paymentStatus: order.payment_status,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

router.get('/my-orders', async (req, res) => {
  try {
    // Demo mode - use a fixed user ID or get from query
    const userId = req.query.userId as string || 'demo-user-id';

    const result = await query(`
      SELECT o.*,
             JSON_AGG(
               JSON_BUILD_OBJECT(
                 'id', oi.id,
                 'productId', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.payment_status, o.created_at, o.updated_at
      ORDER BY o.created_at DESC
    `, [userId]);

    const response: ServiceResponse<Order[]> = {
      success: true,
      data: result.rows
    };

    res.json(response);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to get orders' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, id]);

    const result = await query('SELECT * FROM orders WHERE id = $1', [id]);

    const response: ServiceResponse<Order> = {
      success: true,
      data: result.rows[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

export { router as orderRoutes };
