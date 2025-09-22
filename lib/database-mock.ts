// Database mock temporaneo per test
let mockUsers: any[] = [];
let mockSubscriptions: any[] = [];
let mockCodes: string[] = [];

export async function mockExecute(query: string, params: any[] = []) {
  console.log('Mock DB Query:', query, params);

  // Simulate getUserByFiscalCode
  if (query.includes('SELECT * FROM users WHERE fiscal_code')) {
    const fiscalCode = params[0];
    const user = mockUsers.find(u => u.fiscal_code === fiscalCode);
    return [[user].filter(Boolean), []];
  }

  // Simulate ensureUniqueCode check
  if (query.includes('SELECT unique_code FROM users WHERE unique_code')) {
    const code = params[0];
    const exists = mockCodes.includes(code) || mockUsers.some(u => u.unique_code === code);
    return [exists ? [{ unique_code: code }] : [], []];
  }

  // Simulate insert generated code
  if (query.includes('INSERT INTO generated_codes')) {
    const code = params[0];
    mockCodes.push(code);
    return [{ insertId: Date.now() }, []];
  }

  // Simulate insert user
  if (query.includes('INSERT INTO users')) {
    const [fiscalCode, firstName, lastName, birthDate, uniqueCode] = params;
    const user = {
      id: Date.now(),
      fiscal_code: fiscalCode,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      unique_code: uniqueCode
    };
    mockUsers.push(user);
    return [{ insertId: user.id }, []];
  }

  // Simulate insert subscription
  if (query.includes('INSERT INTO subscriptions')) {
    const [userId, customerId, productType, amount, status] = params;
    const subscription = {
      id: Date.now(),
      user_id: userId,
      stripe_customer_id: customerId,
      product_type: productType,
      amount: amount,
      status: status
    };
    mockSubscriptions.push(subscription);
    return [{ insertId: subscription.id }, []];
  }

  // Simulate count active subscriptions
  if (query.includes('COUNT(*) as count FROM subscriptions')) {
    const userId = params[0];
    const count = mockSubscriptions.filter(s => s.user_id === userId && s.status === 'active').length;
    return [[{ count }], []];
  }

  // Default response
  return [[], []];
}

export const pool = {
  execute: mockExecute
};