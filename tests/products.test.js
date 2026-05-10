// tests/products.test.js
const { mockDb, mockProducts, mockModel } = require('./db.mock');
const { list, get, destroy } = require('../products');

// Mock the db module to use our mockDb
jest.mock('../db', () => ({
    model: jest.fn((name) => mockModel)
}));

describe('Product Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should list products', async () => {
      const products = await list();
      expect(products.length).toBe(2);
      expect(products[0].description).toBe('Product 1');
      expect(products[1].description).toBe('Product 2');
    });
  });

  describe('get', () => {
    it('should get a product by id', async () => {
      // Mock the Product.findById method to return a specific product
      mockModel.findById = jest.fn().mockResolvedValue({ _id: 'prod1', description: 'Product 1' });

      // call to get the product using the `get` method
      const product = await get('prod1');
      expect(product).toBeDefined();
      expect(product.description).toBe('Product 1');
    });
  });

  describe('destroy', () => {
    it('should delete a product', async () => {
      // Mock the Product.deleteOne method to return deletedCount
      mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const result = await destroy('prod1');
      expect(result.deletedCount).toBe(1);
    });
  });
});
