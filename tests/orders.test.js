// tests/orders.test.js
const { create, get, list, edit } = require('../orders');
const orderData = require('../data/order1.json');
const productTestHelper = require('./test-utils/productTestHelper');
const db = require('../db');

describe('Orders Module', () => {
 
  let createdProduct;
  let createdOrder;

  // Populate the database with dummy data
  beforeAll(async () => {
    // Clear any existing data first
    try {
      const Order = db.model('Order');
      const Product = db.model('Product');
      
      // Delete all existing products and orders
      await Product.deleteMany({});
      await Order.deleteMany({});
    } catch (e) {
      // Silent catch - collections might not exist yet
    }

    await productTestHelper.setupTestData();
    const orders = await productTestHelper.createTestOrders(5);
    // Store one of the created orders for later tests
    if (orders && orders.length > 0) {
      createdOrder = orders[0];
    }
  });

  afterAll(async () => {
    await productTestHelper.cleanupTestData();
  });

  describe('list', () => {
    it('should list orders', async () => {
      const orders = await list();
      expect(orders.length).toBeGreaterThan(4);
    });
  });

  describe('create', () => {
    it('should create an order', async () => {
      createdOrder = await create(orderData);
      expect(createdOrder).toBeDefined();
      expect(createdOrder.buyerEmail).toBe(orderData.buyerEmail);
    });
  });

  describe('get', () => {
    it('should retrieve an order by id', async () => {
      const order = await get(createdOrder._id);
      expect(order).toBeDefined();
      expect(order._id).toBe(createdOrder._id);
    });
  });

  describe('edit', () => {
    it('should edit an order', async () => {
      const change = { status: 'PENDING' };
      const editedOrder = await edit(createdOrder._id, change);
      expect(editedOrder).toBeDefined();
      expect(editedOrder.status).toBe('PENDING');
    });
  });
});
