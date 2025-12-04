/**
 * Basic smoke test for HumanLiker backend server
 */

const app = require('../backend/server');

describe('HumanLiker Backend', () => {
  test('server module is defined', () => {
    expect(app).toBeDefined();
  });

  test('server is an Express application', () => {
    expect(typeof app).toBe('function');
    expect(app).toHaveProperty('use');
    expect(app).toHaveProperty('get');
    expect(app).toHaveProperty('post');
  });
});
