const pool = require('../db');
const { getDownloadURL, uploadBytes, ref } = require('firebase/storage');
const { getStorage } = require('firebase/storage');

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function insertAdmin(full_name, email, password, phone) {
  const result = await pool.query('INSERT INTO users (full_name, email, password, phone, user_role, is_deleted) VALUES ($1, $2, $3, $4, $5, false) RETURNING *', [full_name, email, password, phone, 1]);
  return result.rows[0];
}

async function getStadiumRequests() {
  const result = await pool.query('SELECT * FROM stadiums WHERE approval_status = $1', ['pending']);
  return result.rows;
}

async function getAllStadiums(page, pageSize) {
  const offset = (page - 1) * pageSize;

  const allStadiumsResult = await pool.query(
    'SELECT * FROM stadiums WHERE deleted = false LIMIT $1 OFFSET $2',
    [pageSize, offset]
  );

  return allStadiumsResult.rows;
}

async function searchStadiums(searchQuery) {
  const stadiumsResult = await pool.query('SELECT * FROM stadiums WHERE name ILIKE $1', [`%${searchQuery}%`]);
  return stadiumsResult.rows;
}

async function approveStadium(stadiumId) {
  const result = await pool.query(
    'UPDATE stadiums SET approval_status = $1, deleted = $2 WHERE stadium_id = $3 RETURNING *',
    ['approved', false, stadiumId]
  );

  return result.rows[0];
}

async function rejectStadium(stadiumId) {
  const result = await pool.query(
    'UPDATE stadiums SET approval_status = $1, deleted = $2 WHERE stadium_id = $3 RETURNING *',
    ['rejected', true, stadiumId]
  );

  return result.rows[0];
}

async function deleteStadium(stadiumId) {
  const result = await pool.query(
    'UPDATE stadiums SET deleted = true, approval_status = $2 WHERE stadium_id = $1 RETURNING *',
    [stadiumId, 'deleted']
  );

  return result.rows[0];
}

async function deleteStadiumOwner(userId) {
  const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [userId]);

  return result.rows[0];
}

async function getDeletedUsers() {
  try {
    const result = await pool.query('SELECT user_id, full_name FROM users WHERE is_deleted = true');
    return result.rows;
  } catch (error) {
    console.error('Error executing query', error);
    throw new Error('Internal server error');
  }
}

async function getUserCount() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users WHERE is_deleted = false');
    return result.rows[0].count;
  } catch (error) {
    console.error('Error executing query', error);
    throw new Error('Internal server error');
  }
}

async function getAllUsers(page, pageSize) {
  try {
    const offset = (page - 1) * pageSize;
    const result = await pool.query('SELECT user_id, full_name, email, user_role FROM users WHERE is_deleted = false LIMIT $1 OFFSET $2', [pageSize, offset]);
    return result.rows;
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
}
async function getStadiumCountByStatus(req, res) {
  const { status } = req.params;

  try {
    const stadiumCount = await adminModel.getStadiumCountByStatus(status);
    res.json({ message: 'Stadium count retrieved successfully', stadiumCount });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



async function approveStadium(stadiumId) {
  try {
    const result = await pool.query(
      'UPDATE stadiums SET approval_status = $1, deleted = $2 WHERE stadium_id = $3 RETURNING *',
      ['approved', false, stadiumId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
}


async function updateUserRole(userId, role) {
  try {
    const result = await pool.query('UPDATE users SET user_role = $1 WHERE user_id = $2 RETURNING *', [role, userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
}

async function getStadiumCountByStatus(status) {
  try {
    let query;
    switch (status) {
      case 'approved':
      case 'pending':
      case 'rejected':
        query = 'SELECT COUNT(*) FROM stadiums WHERE approval_status = $1';
        break;
      default:
        throw new Error('Invalid status parameter');
    }

    const result = await pool.query(query, [status]);
    return result.rows[0].count;
  } catch (error) {
    console.error('Error executing query', error);
    throw new Error('Internal server error');
  }
}

async function getBookingsInfo(pageSize, offset) {
  const result = await pool.query(`
    SELECT
        b.booking_id,
        u.full_name,
        b.phone,
        b.start_time,
        b.end_time,
        b.note,
        b.status,
        EXTRACT(HOUR FROM (b.end_time - b.start_time)) AS total_hours
    FROM
        public.bookings b
    JOIN
        public.users u ON b.user_id = u.user_id
    LIMIT $1 OFFSET $2;
  `, [pageSize, offset]);

  return result.rows;
}

async function addProduct(type, name, description, price, categories, color, quantity, images,
  size_38, size_39, size_40, size_small, size_medium, size_large) {
  try {
    let result;

    if (images.length === 0) {
      throw new Error('No images provided');
    }

    result = await pool.query(
      `INSERT INTO products (type, name, description, price, categories, color, quantity, images, created_at, deleted, 
      size_38, size_39, size_40, size_small, size_medium, size_large)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, current_timestamp, false, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        type, name, description, price, categories, color, quantity,
        images, // استخدم النص المنسق مباشرة
        size_38, size_39, size_40, size_small, size_medium, size_large
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error adding product to the database:', error);
    throw new Error('Internal server error');
  }
}




module.exports = {
  getUserByEmail,
  insertAdmin,
  getStadiumRequests,
  getAllStadiums,
  searchStadiums,
  approveStadium,
  rejectStadium,
  deleteStadium,
  deleteStadiumOwner,
  getDeletedUsers,
  getUserCount,
  getAllUsers,
  getStadiumCountByStatus,
  updateUserRole,
  getStadiumCountByStatus,
  getBookingsInfo,
  addProduct,

};
