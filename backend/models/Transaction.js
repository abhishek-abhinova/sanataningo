const { promisePool } = require('../config/mysql-connection');

class Transaction {
  // Create new transaction
  static async create(transactionData) {
    const {
      transaction_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency = 'INR',
      status = 'created',
      transaction_type,
      reference_id,
      payer_name,
      payer_email,
      payer_phone,
      payment_method
    } = transactionData;

    const query = `
      INSERT INTO transactions (
        transaction_id, razorpay_order_id, razorpay_payment_id, razorpay_signature,
        amount, currency, status, transaction_type, reference_id,
        payer_name, payer_email, payer_phone, payment_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await promisePool.query(query, [
      transaction_id, razorpay_order_id, razorpay_payment_id, razorpay_signature,
      amount, currency, status, transaction_type, reference_id,
      payer_name, payer_email, payer_phone, payment_method
    ]);

    return this.findById(result.insertId);
  }

  // Find transaction by ID
  static async findById(id) {
    const query = 'SELECT * FROM transactions WHERE id = ?';
    const [transactions] = await promisePool.query(query, [id]);
    return transactions[0] || null;
  }

  // Find by transaction ID
  static async findByTransactionId(transaction_id) {
    const query = 'SELECT * FROM transactions WHERE transaction_id = ?';
    const [transactions] = await promisePool.query(query, [transaction_id]);
    return transactions[0] || null;
  }

  // Get all transactions
  static async findAll(options = {}) {
    const { status, transaction_type, page = 1, limit = 20 } = options;

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (transaction_type) {
      query += ' AND transaction_type = ?';
      params.push(transaction_type);
    }

    query += ' ORDER BY created_at DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [transactions] = await promisePool.query(query, params);
    return transactions;
  }

  // Update transaction
  static async update(id, transactionData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'razorpay_payment_id', 'razorpay_signature', 'status', 'payment_method'
    ];

    allowedFields.forEach(field => {
      if (transactionData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(transactionData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE transactions SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete transaction
  static async delete(id) {
    const query = 'DELETE FROM transactions WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }
}

module.exports = Transaction;