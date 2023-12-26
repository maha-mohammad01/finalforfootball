const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const multer = require('multer');
const app = express();
const secretKey = 'your_secret_key';
const cors = require('cors');
const path = require("path");
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const axios = require('axios');

const admin = require("firebase-admin");
const imagesArray = ["url1", "url2", "url3"];
const imagesString = JSON.stringify(imagesArray);
require('dotenv').config();
app.use(express.json());


const userRoutes = require('./routes/userRoutes');
const contactsRoutes = require('./routes/contactsRoutes');
const stadiumRoutes = require('./routes/stadiumRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 
const productsRoute = require('./routes/productsRoute');
const BookingRoutes=require(`./routes/BookingRoutes`)
const stripe = require('stripe')('sk_test_51OFEgrGROfSjwnSRPJAx7TNHX9OLkJDGMAZGz9erdBAKxhhpASVfzwdrOWtgjXASyPEAsO5n8WPVhoMNMZKDnQpI00VTEQPxcd');
const stripeApiEndpoint = 'https://api.stripe.com/v1/payment_intents'; 

const retrievedArray = JSON.parse(imagesString);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors());
// Initialize Firebase
const { initializeApp } = require("firebase/app");
const firebaseConfig = {
  apiKey: "AIzaSyCeNNeNQ4Ec7rezMUKd_PyiOX7pESvh8tA",
  authDomain: "football-626b1.firebaseapp.com",
  projectId: "football-626b1",
  storageBucket: "football-626b1.appspot.com",
  messagingSenderId: "1019343220790",
  appId: "1:1019343220790:web:0fe1482e424a9b5df0a897"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const uploadPath = 'C:/Users/Orange/Desktop/masterpiece/masterpiece/images'; 
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

app.use(bodyParser.json());
const pool = new Pool({
  user: 'postgres',
  password: '123',
  host: 'localhost',
  port: 5432,
  database: 'football',
});


// Middleware
app.use(cors()); 
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);
app.use('/', contactsRoutes);
app.use('/', adminRoutes); 
app.use('/', productsRoute);
app.use('/', stadiumRoutes);
app.use('/',BookingRoutes)

// // Middleware للتحقق من التوكن
function authenticateToken(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
// console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.is_deleted) {
      return res.status(401).json({ message: 'User account has been deleted' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


function authenticateAdminToken(req, res, next) {
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      
      if (decoded.user_role !== "1") {
        return res.status(403).json({ message: 'Forbidden, admin access required' });
      }
  
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  
 

// app.post('/add-product', authenticateAdminToken, upload.array('images', 5), async (req, res) => {
//   const { type, name, description, price, categories, color, quantity,
//       size_38, size_39, size_40, size_small, size_medium, size_large,
//   } = req.body;

//   try {
//       let images = [];

//       if (req.files && req.files.length > 0) {
//           const storageRef = ref(storage, 'product-images');

//           // رفع كل صورة إلى Firebase Storage
//           for (const file of req.files) {
//               try {
//                   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//                   const fileExtension = path.extname(file.originalname);
//                   const fileName = `images-${uniqueSuffix}${fileExtension}`;
//                   const fileRef = ref(storageRef, fileName);
//                   await uploadBytes(fileRef, file.buffer);

//                   const downloadURL = await getDownloadURL(fileRef);
//                   images.push(downloadURL);
//               } catch (error) {
//                   console.error('Error uploading image to Firebase Storage:', error);
//                   return res.status(500).json({ message: 'Error uploading image to Firebase Storage' });
//               }
//           }
//       }

//       const result = await pool.query(
//           `INSERT INTO products (type, name, description, price, categories, color, quantity, images, created_at, deleted, 
//           size_38, size_39, size_40, size_small, size_medium, size_large)
//           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, current_timestamp, false, $9, $10, $11, $12, $13, $14) RETURNING *`,
//           [
//               type, name, description, price, categories, color, quantity,
//               images, // استخدم النص المنسق مباشرة
//               size_38 === 'true', size_39 === 'true', size_40 === 'true',
//               size_small === 'true', size_medium === 'true', size_large === 'true'
//           ]
//       );

//       // تحديث الكمية في حال نجاح إدراج المنتج
//       if (result.rows.length > 0) {
//           const productId = result.rows[0].id_product;
//           await pool.query(
//               'UPDATE products SET quantity = $1 WHERE id_product = $2',
//               [quantity, productId]
//           );
//           res.json({ message: 'Product added successfully', product: result.rows[0] });
//       } else {
//           return res.status(500).json({ message: 'Error adding product to the store' });
//       }
//   } catch (error) {
//       console.error('Error executing query', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });


// قم بإضافة هذه القطعة من الكود إلى ملف الخادم الخاص بك

// app.get('/products/:type?', async (req, res) => {
//   try {
//       let result;

//       if (req.params.type) {
//           const productType = req.params.type;
//           result = await pool.query(
//               'SELECT * FROM products WHERE type = $1 AND deleted = false',
//               [productType]
//           );
//       } else {
//           result = await pool.query(
//               'SELECT * FROM products WHERE deleted = false'
//           );
//       }

//       res.json(result.rows);
//   } catch (error) {
//       console.error('Error executing query', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });



///////////////////////////super user //////////////////////////////////////////////////////////////////////
// app.get('/stadium-bookings', authenticateToken, async (req, res) => {
//   const { user_id } = req.user;

//   try {
//     // استرجاع حجوزات الملعب مع معلومات المستخدم والملعب
//     const bookingsResult = await pool.query(`
//       SELECT 
//         bookings.booking_id,
//         bookings.booking_date,
//         bookings.start_time,
//         bookings.end_time,
//         bookings.note,
//         stadiums.name AS stadium_name,
//         users.full_name AS user_name,
//         EXTRACT(EPOCH FROM (bookings.end_time - bookings.start_time))/3600 AS hours_booked
//       FROM 
//         bookings
//       JOIN 
//         stadiums ON bookings.stadium_id = stadiums.stadium_id
//       JOIN 
//         users ON bookings.user_id = users.user_id
//       WHERE 
//         stadiums.owner_id = $1
//     `, [user_id]);

//     res.json({ stadium_bookings: bookingsResult.rows });
//   } catch (error) {
//     console.error('Error executing query', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


app.post('/approve-booking/:booking_id', authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const { booking_id } = req.params;

  try {
    // تحقق مما إذا كان المستخدم هو مالك الملعب
    const stadiumResult = await pool.query('SELECT owner_id FROM stadiums WHERE owner_id = $1', [user_id]);

    if (stadiumResult.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized. You are not the owner of this stadium.' });
    }

    // قم بتحديث حالة الحجز إلى "approved" بدون التحقق من التضارب
    const updateResult = await pool.query('UPDATE bookings SET status = $1 WHERE booking_id = $2 RETURNING *', ['approved', booking_id]);

    res.json({ message: 'Booking approved successfully', booking: updateResult.rows[0] });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/reject-booking/:booking_id', authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const { booking_id } = req.params;

  try {
    const stadiumResult = await pool.query('SELECT owner_id FROM stadiums WHERE owner_id = $1', [user_id]);

    if (stadiumResult.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized. You are not the owner of this stadium.' });
    }

    const bookingResult = await pool.query('SELECT * FROM bookings WHERE booking_id = $1', [booking_id]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // قم بتحديث حالة الحجز إلى "rejected" بدون التحقق من التضارب
    const updateResult = await pool.query('UPDATE bookings SET status = $1 WHERE booking_id = $2 RETURNING *', ['rejected', booking_id]);

    res.json({ message: 'Booking rejected successfully', booking: updateResult.rows[0] });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/book-stadium', authenticateToken, async (req, res) => {
  const { stadium_id, start_time, end_time, booking_date, note, phone, payment_method } = req.body;
  const { user_id } = req.user;

  try {
    // Check for conflicts in existing bookings
    const conflictCheck = await pool.query(
      'SELECT * FROM bookings WHERE stadium_id = $1 AND booking_date = $2 AND ((start_time >= $3 AND start_time < $4) OR (end_time > $3 AND end_time <= $4))',
      [stadium_id, booking_date, start_time, end_time]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Stadium is already booked during this period' });
    }

    // Insert the new booking
    const result = await pool.query(
      'INSERT INTO bookings (stadium_id, user_id, start_time, end_time, booking_date, note, phone, status, payment_method) VALUES ($1, $2, $3::time, $4::time, $5, $6, $7, $8, $9) RETURNING *',
      [stadium_id, user_id, start_time, end_time, booking_date, note, phone, 'pending', payment_method]
    );

    res.json({ message: 'Booking request added successfully', booking: result.rows[0] });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//   ///////////////////////////////////////////STAD/////////////////////////////////////////////////////////////////
  // بوست لإضافة ملعب
//   app.post('/add-stadium', authenticateToken, upload.array('images_url', 5), async (req, res) => {
//     const { name, city, location, size, hourly_rate, description, phone, start_time, end_time } = req.body;
//     const { user_id } = req.user;

//     try {
//         // التحقق من عدم تكرار اسم الملعب
//         const existingStadium = await pool.query('SELECT * FROM stadiums WHERE name = $1', [name]);

//         if (existingStadium.rows.length > 0) {
//             return res.status(400).json({ message: 'Stadium name already exists' });
//         }

//         let formattedUrls = [];

//         if (req.files && req.files.length > 0) {
//             const storageRef = ref(storage, 'stadium-images');

//             // Upload each image to Firebase Storage
//             for (const file of req.files) {
//                 try {
//                     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//                     const fileExtension = path.extname(file.originalname);
//                     const fileName = `image-${uniqueSuffix}${fileExtension}`;
//                     const fileRef = ref(storageRef, fileName);
//                     await uploadBytes(fileRef, file.buffer);

//                     const downloadURL = await getDownloadURL(fileRef);
//                     formattedUrls.push(downloadURL);
//                 } catch (error) {
//                     console.error('Error uploading image to Firebase Storage:', error);
//                     return res.status(500).json({ message: 'Error uploading image to Firebase Storage' });
//                 }
//             }
//         }

//         const result = await pool.query(
//           'INSERT INTO stadiums (name, city, location, size, hourly_rate, description, owner_id, approval_status, images_url, phone, start_time, end_time, deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false) RETURNING *',
//           [name, city, location, size, hourly_rate, description, user_id, 'pending', formattedUrls, phone, start_time, end_time]
//         );      

//         res.json({ message: 'Stadium request added successfully', stadium: result.rows[0] });
//     } catch (error) {
//         console.error('Error executing query', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// app.get('/stadiums', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT stadium_id, name, city, location, size, hourly_rate, description, owner_id, approval_status, images_url, phone, start_time, end_time, deleted FROM public.stadiums WHERE approval_status = $1', ['approved']);
//     const stadiums = result.rows;

//     const stadiumsWithImageUrl = stadiums.map(stadium => {
//       if (stadium.images_url && Array.isArray(stadium.images_url)) {
//         return {
//           ...stadium,
//           images_url: stadium.images_url.map(url => {
//             const basename = path.basename(url);
//             const formattedUrl = `https://firebasestorage.googleapis.com/v0/b/football-626b1.appspot.com/o/${basename}?alt=media&token=860bf795-35f4-485e-a2d7-285a02d27bcd`;
//             return formattedUrl;
//           })
//         };
//       } else if (stadium.images_url && typeof stadium.images_url === 'object') {
//         return {
//           ...stadium,
//           images_url: stadium.images_url
//         };
//       } else {
//         return stadium;
//       }
//     });

//     res.json(stadiumsWithImageUrl);
//   } catch (error) {
//     console.error('Error fetching stadiums:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// app.get('/my-stadium', authenticateToken, async (req, res) => {
//   const { user_id } = req.user;

//   try {
    
//     const mystadium = await pool.query('SELECT * FROM stadiums WHERE owner_id = $1', [user_id]);

//     if (mystadium.rows.length === 0) {
//       return res.status(404).json({ message: 'Stadium not found or unauthorized' });
//     }

//     res.json({ message: 'Stadium retrieved successfully', stadium: mystadium.rows[0] });
//   } catch (error) {
//     console.error('Error executing query', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// app.get('/details/:stadium_id', async (req, res) => {
//   const stadiumId = req.params.stadium_id;

//   try {
//       const stadiumResult = await pool.query('SELECT * FROM stadiums WHERE stadium_id = $1', [stadiumId]);

//       if (stadiumResult.rows.length === 0) return res.status(404).json({ message: 'Stadium not found' });

//       const { stadium_id, name, city, location, size, hourly_rate, description, phone, start_time, end_time, images_url } = stadiumResult.rows[0];

//       // استخدم JSON.parse لتحويل النص إلى مصفوفة إذا كانت ليست بالفعل
//       const imagesArray = Array.isArray(images_url) ? images_url : JSON.parse(images_url);

//       const stadiumData = {
//           stadium_id,
//           name,
//           city,
//           location,
//           size,
//           hourly_rate,
//           description,
//           phone,
//           start_time,
//           end_time,
//           images_url: imagesArray
//       };

//       res.json({ stadium: stadiumData });

//   } catch (error) {
//       console.error('Error executing query', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // بوست لتحديث بيانات الملعب
// app.post('/update-stadium', authenticateToken, upload.array('images_url', 5), async (req, res) => {
//   const { name, city, location, size, hourly_rate, description, phone, start_time, end_time } = req.body;
//   const { user_id } = req.user;

//   try {
//       // التحقق من أن المستخدم هو مالك الملعب
//       const isStadiumOwner = await pool.query('SELECT * FROM stadiums WHERE owner_id = $1', [user_id]);

//       if (isStadiumOwner.rows.length === 0) {
//           return res.status(403).json({ message: 'Unauthorized - User is not the stadium owner' });
//       }

//       let formattedUrls = [];

//       if (req.files && req.files.length > 0) {
//           const storageRef = ref(storage, 'stadium-images');

//           // Upload each image to Firebase Storage
//           for (const file of req.files) {
//               try {
//                   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//                   const fileExtension = path.extname(file.originalname);
//                   const fileName = `image-${uniqueSuffix}${fileExtension}`;
//                   const fileRef = ref(storageRef, fileName);
//                   await uploadBytes(fileRef, file.buffer);

//                   const downloadURL = await getDownloadURL(fileRef);
//                   formattedUrls.push(downloadURL);
//               } catch (error) {
//                   console.error('Error uploading image to Firebase Storage:', error);
//                   return res.status(500).json({ message: 'Error uploading image to Firebase Storage' });
//               }
//           }
//       }

//       // تحديث بيانات الملعب
//       const result = await pool.query(`
//           UPDATE stadiums 
//           SET 
//               name = $1, 
//               city = $2, 
//               location = $3, 
//               size = $4, 
//               hourly_rate = $5, 
//               description = $6, 
//               phone = $7, 
//               start_time = $8, 
//               end_time = $9, 
//               images_url = $10 
//           WHERE owner_id = $11
//           RETURNING *
//       `, [name, city, location, size, hourly_rate, description, phone, start_time, end_time, formattedUrls, user_id]);

//       res.json({ message: 'Stadium updated successfully', stadium: result.rows[0] });
//   } catch (error) {
//       console.error('Error executing query', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });



// app.delete('/delete-my-stadium', authenticateToken, async (req, res) => {
//   const { user_id } = req.user;

//   try {
   
//     const stadiumResult = await pool.query('UPDATE stadiums SET deleted = true, owner_id = null WHERE stadium_id = $1 AND owner_id = $2 RETURNING *', [stadium_id, user_id]);

//     if (stadiumResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Stadium not found or unauthorized' });
//     }

//     const stadium_id = stadiumResult.rows[0].stadium_id;

//     // Soft Delete للملعب
//     const updateResult = await pool.query('UPDATE stadiums SET deleted = true, owner_id = null WHERE stadium_id = $1 RETURNING *', [stadium_id]);

//     res.json({ message: 'Stadium deleted successfully', stadium: updateResult.rows[0] });
//   } catch (error) {
//     console.error('Error executing query', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

///////////////////////////////////////// BOOKING ////////////////////////////////////////////////////////////

// app.post('/book-stadium/:stadium_id', authenticateToken, async (req, res) => {
//   const stadium_id = req.params.stadium_id;
//   console.log("stadium_id",stadium_id)
//   const { start_time, end_time, booking_date, note, phone } = req.body; // تعديل هنا
//   const { user_id } = req.user;

//   try {
//     // التحقق من توفر الملعب والتحقق من عدم وجود تعارض في الحجز
//     const conflictCheck = await pool.query(
//       'SELECT * FROM bookings WHERE stadium_id = $1 AND booking_date = $2 AND ((start_time >= $3 AND start_time < $4) OR (end_time > $3 AND end_time <= $4))',
//       [stadium_id, booking_date, start_time, end_time]
//     );

//     if (conflictCheck.rows.length > 0) {
//       return res.status(400).json({ message: 'Stadium is already booked during this period' });
//     }

//     // إضافة الحجز
//     const result = await pool.query(
//       'INSERT INTO bookings (stadium_id, user_id, start_time, end_time, booking_date, note, phone) VALUES ($1, $2, $3::time, $4::time, $5, $6, $7) RETURNING *',
//       [stadium_id, user_id, start_time, end_time, booking_date, note, phone]
//     );

//     res.json({ message: 'Stadium booked successfully', booking: result.rows[0] });
//   } catch (error) {
//     console.error('Error executing query', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });



// app.get('/user-bookings', authenticateToken, async (req, res) => {
//   const { user_id } = req.user;

//   try {
//     const bookingsResult = await pool.query('SELECT bookings.*, stadiums.name FROM bookings JOIN stadiums ON bookings.stadium_id = stadiums.stadium_id WHERE bookings.user_id = $1', [user_id]);

//     const formattedBookings = bookingsResult.rows.map(booking => ({
//       booking_date: booking.booking_date, // Keep the raw date value
//       start_time: booking.start_time,
//       end_time: booking.end_time,
//       name: booking.name 
//     }));

//     res.json({ bookings: formattedBookings });

//   } catch (error) {
//     console.error('Error executing query', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


  // تمديد حجز الملعب
  app.put('/extend-booking/:booking_id', authenticateToken, async (req, res) => {
    const { booking_id } = req.params;
    const { start_time, end_time } = req.body;
  
    try {
      // التحقق من وجود الحجز والتحقق من أن الحجز للمستخدم الحالي
      const result = await pool.query(
        'UPDATE bookings SET start_time = $1::time, end_time = $2::time WHERE booking_id = $3 AND user_id = $4 RETURNING *',
        [start_time, end_time, booking_id, req.user.user_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Booking not found or unauthorized' });
      }
  
      res.json({ message: 'Booking extended successfully', booking: result.rows[0] });
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.put('/cancelBooking/:booking_id', authenticateToken, async (req, res) => {
    const { booking_id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE bookings SET deleted = true WHERE booking_id = $1 AND user_id = $2 RETURNING *',
            [booking_id, req.user.user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found or unauthorized' });
        }

        res.json({ message: 'Booking canceled successfully', booking: result.rows[0] });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


/////////////////////////// add comment & rete ////////////////////////////////////////////////////////////
// إضافة تقييم وتعليق
app.post('/add-review', authenticateToken, async (req, res) => {
  const { stadium_id, rating, comment } = req.body;
  const { user_id } = req.user;

  try {
    // التحقق من وجود تقييم سابق للمستخدم على هذا الملعب
    const existingReviewResult = await pool.query(
      'SELECT * FROM stadium_reviews WHERE stadium_id = $1 AND user_id = $2',
      [stadium_id, user_id]
    );

    if (existingReviewResult.rows.length === 0) {
      // إذا لم يكن هناك تقييم سابق، أقم بإضافة تقييم جديد
      const result = await pool.query(
        'INSERT INTO stadium_reviews (stadium_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
        [stadium_id, user_id, rating, comment]
      );

      res.json({ message: 'Review added successfully', review: result.rows[0] });
    } else {
      // إذا كان هناك تقييم سابق، قم بتحديثه
      const result = await pool.query(
        'UPDATE stadium_reviews SET rating = $1, comment = $2 WHERE stadium_id = $3 AND user_id = $4 RETURNING *',
        [rating, comment, stadium_id, user_id]
      );

      res.json({ message: 'Review updated successfully', review: result.rows[0] });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////






app.post('/admin-reply', authenticateAdminToken, async (req, res) => {
  const { email, reply } = req.body;

  try {
    // Update the contact message with the admin's reply based on email
    const updateResult = await pool.query('UPDATE public.contacts SET admin_reply = $1 WHERE email = $2 RETURNING *', [reply, email]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    const updatedMessage = updateResult.rows[0];

    // Fetch the updated message including the admin_reply
    const selectResult = await pool.query('SELECT * FROM public.contacts WHERE email = $1', [email]);

    if (selectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Admin reply sent successfully', updatedMessage: selectResult.rows[0] });
  } catch (error) {
    console.error('Error replying to contact message', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
/////////////////////////////////////////payment////////////////////////////////////////////////////////////////////
app.post('/payment', authenticateToken, async (req, res) => {
  try {
    const { user_id, email, name } = req.user;

    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
    });

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: req.body.currency || "USD",
      customer: customer.id,
    });
    const updateStatusQuery = 'UPDATE stadiums SET approval_status = $1 WHERE owner_id = $2 AND approval_status = $3 RETURNING approval_status';
    const updatedStatus = await pool.query(updateStatusQuery, ['approved', user_id, 'pending']);

    const updateUserRoleQuery = 'UPDATE users SET user_role = $1 WHERE user_id = $2 RETURNING user_role';
    const updatedUserRole = await pool.query(updateUserRoleQuery, [2, user_id]);

    const updateBookingQuery = 'UPDATE bookings SET status = $1, payment_method = $2 WHERE booking_id = $3 RETURNING *';
    const updatedBooking = await pool.query(updateBookingQuery, ['approved', 'stripe', req.body.booking_id]);

    // Insert payment details into the payments table
    const insertPaymentQuery = `
      INSERT INTO payments (user_id, stadium_id, booking_id, payment_amount, payment_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;

    const paymentResult = await pool.query(insertPaymentQuery, [
      user_id,
      req.body.stadium_id,
      req.body.booking_id,
      req.body.amount,
      new Date()
    ]);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      updatedStatus: updatedStatus.rows[0],
      updatedUserRole: updatedUserRole.rows[0],
      updatedBooking: updatedBooking.rows[0],
      paymentResult: paymentResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing payment' });
  }
});
// app.post('/payment', authenticateToken, async (req, res) => {
//   try {
//     const { user_id, email, name } = req.user;
//     const { user, selectedPlan } = req.body;

//     // Create a Stripe customer
//     const customer = await stripe.customers.create({
//       email: user.email,
//       name: user.name,
//     });

//     // Create a PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: req.body.amount,
//       currency: req.body.currency || "USD",
//       customer: customer.id,
//     });

//     // ... (Rest of your payment processing logic)

//     // Insert payment details into the payments table
//     const insertPaymentQuery = `
//       INSERT INTO payments (user_id, stadium_id, booking_id, payment_amount, payment_date)
//       VALUES ($1, $2, $3, $4, $5)
//       RETURNING *`;

//     const paymentResult = await pool.query(insertPaymentQuery, [
//       user_id,
//       req.body.stadium_id,
//       req.body.booking_id,
//       req.body.amount,
//       new Date()
//     ]);

//     // Return success response
//     res.status(200).json({
//       success: true,
//       message: 'Payment processed successfully',
//       // ... (other data you want to return)
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while processing payment' });
//   }
// });



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// app.post('/AddToCart', authenticateToken, async (req, res) => {
//   const { id_product, quantity } = req.body;
//   const { user_id } = req.user;

//   try {
//     // Fetch product information
//     const productResult = await pool.query('SELECT * FROM products WHERE id_product = $1', [id_product]);

//     if (productResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = productResult.rows[0];
//     const total_price = product.price * quantity;

//     if (product.quantity < quantity) {
//       return res.status(400).json({ message: 'Insufficient quantity available' });
//     }

//     // Start a transaction
//     const client = await pool.connect();
//     try {
//       // Begin the transaction
//       await client.query('BEGIN');

//       // Insert into the cart
//       const cartResult = await client.query(
//         `INSERT INTO cart (user_id, product_id, quantity, total_price, created_at)
//         VALUES ($1, $2, $3, $4, current_timestamp) RETURNING *`,
//         [user_id, id_product, quantity, total_price]
//       );

//       // Update product quantity
//       const updatedQuantity = product.quantity - quantity;
//       await client.query('UPDATE products SET quantity = $1 WHERE id_product = $2', [updatedQuantity, id_product]);

//       // Commit the transaction
//       await client.query('COMMIT');

//       res.json({ message: 'Product added to cart successfully', cart_item: cartResult.rows[0] });
//     } catch (error) {
//       // If there's an error, rollback the transaction
//       await client.query('ROLLBACK');
//       throw error;
//     } finally {
//       // Release the client back to the pool
//       client.release();
//     }
//   } catch (error) {
//     console.error('Error executing query', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.get('/ViewCart', authenticateToken, async (req, res) => {
//   const { user_id } = req.user;

//   try {
//     const cartItemsResult = await pool.query(
//       `SELECT c.*, p.price
//        FROM cart c
//        JOIN products p ON c.product_id = p.id_product
//        WHERE c.user_id = $1`,
//       [user_id]
//     );

//     res.json({ message: 'Cart items retrieved successfully', cart_items: cartItemsResult.rows });
//   } catch (error) {
//     console.error('Error executing query', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });



// app.put('/UpdateCart/:cart_id', authenticateToken, async (req, res) => {
//   const { cart_id } = req.params;
//   const { quantity } = req.body;
//   const { user_id } = req.user;

//   // تحقق من أن القيمة هي رقم صحيح أو عشري
//   const parsedQuantity = parseFloat(quantity);

//   if (isNaN(parsedQuantity)) {
//     return res.status(400).json({ message: 'Invalid quantity value' });
//   }

//   try {
//     // جلب معلومات العنصر في سلة التسوق
//     const cartItemResult = await pool.query('SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2', [cart_id, user_id]);

//     if (cartItemResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Cart item not found' });
//     }

//     const cartItem = cartItemResult.rows[0];
//     const { product_id, previous_quantity } = cartItem;

//     // جلب معلومات المنتج من جدول المنتجات
//     const productResult = await pool.query('SELECT * FROM store WHERE id_store = $1', [product_id]);

//     if (productResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = productResult.rows[0];
//     const { quantity: availableQuantity, price } = product;

//     // حساب الكمية المتاحة بعد التحديث
//     const updatedAvailableQuantity = availableQuantity + previous_quantity - parsedQuantity;

//     // التحقق من أن الكمية المتاحة لا تصبح سالبة
//     if (updatedAvailableQuantity < 0) {
//       return res.status(400).json({ message: 'Quantity not available' });
//     }

//     // تحديث الكمية والسعر في جدول سلة التسوق
//     const updatedCartItemResult = await pool.query(
//       `UPDATE cart SET quantity = $1, total_price = $2 WHERE cart_id = $3 RETURNING *`,
//       [parsedQuantity, price * parsedQuantity, cart_id]
//     );

//     // إعادة الكمية المتاحة إلى جدول المنتجات
//     await pool.query('UPDATE store SET quantity = $1 WHERE id_store = $2', [updatedAvailableQuantity, product_id]);

//     res.json({ message: 'Cart item updated successfully', cart_item: updatedCartItemResult.rows[0] });
//   } catch (error) {
//     console.error('Error executing query', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// http://localhost:2000/create-checkout-session
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.get('/create-checkout-session', async function getPayment(req, res){
  try{
      // const userID = req.user.id;
      // const allOrders = await Order.findAll({
      //     where : {
      //         user_order_id : userID,
      //         is_deleted : false,
      //         is_payed : false,
      //     }
      // });
      // let total = 0;
      let items = [];
      for (let i = 0; i < 1; i++){
          // total = total + (allOrders[i].order_price * allOrders[i].order_count);
          // let theProduct = await Products.findByPk(allOrders[i].product_order_id);
          // console.log(allOrders[i].order_price)
          items.push({
              price_data : {
                  currency : "usd",
                  product_data : {
                      name : `name of the product from tha array`,
                      // images : [theProduct.img_url],
                      description : `description for all the products from the array`,
                  },
                  unit_amount : `1110`,
              },
              quantity: 5,
          })
      };
      const successUrl = `http://localhost:3000/`;
      const cancelUrl = `http://localhost:3000/not`;
  const session = await stripe.checkout.sessions.create({
      line_items : items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    res.send(session.url);
  }catch(error){
      console.log(error);
      res.status(500).json('error in payment controller')
  }
})

app.post('/order', authenticateToken, async (req, res) => {
  const { cart_id } = req.body;
  const { user_id } = req.user;

  try {
    const cartResult = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND cart_id = $2', [user_id, cart_id]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cartResult.rows[0];
    
    // إضافة العناصر من السلة إلى جدول الطلبات
    await pool.query(
      `INSERT INTO orders (user_id, product_id, quantity, total_price, created_at)
        VALUES ($1, $2, $3, $4, current_timestamp)`,
      [user_id, cartItem.product_id, cartItem.quantity, cartItem.total_price]
    );

    // حذف العنصر من جدول السلة بعد إكمال الشراء
    await pool.query('DELETE FROM cart WHERE cart_id = $1', [cart_id]);

    res.json({ message: 'Purchase completed successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/view-products', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM products WHERE deleted = false');
      res.json({ message: 'Products retrieved successfully', products: result.rows });
  } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/wishlist/:entry_id', authenticateToken, async (req, res) => {
  const { entry_id } = req.params;
  const { user_id } = req.user;

  try {
    const deleteResult = await pool.query(
      'DELETE FROM wishlists WHERE id = $1 AND user_id = $2 RETURNING *',
      [entry_id, user_id]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ message: 'Wishlist entry not found' });
    }

    res.json({ message: 'Wishlist entry deleted successfully', deletedEntry: deleteResult.rows[0] });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/////////////////////////// add comment & rete ////////////////////////////////////////////////////////////
// الطلب للحصول على متوسط التقييم وتحديثه في جدول الاستعراضات
app.post('/add-review', authenticateToken, async (req, res) => {
  const { stadium_id, rating, comment } = req.body;
  const { user_id } = req.user;

  try {
    // التحقق من وجود تقييم سابق للمستخدم على هذا الملعب
    const existingReviewResult = await pool.query(
      'SELECT * FROM stadium_reviews WHERE stadium_id = $1 AND user_id = $2',
      [stadium_id, user_id]
    );

    if (rating >= 1 && rating <= 5) {
      if (existingReviewResult.rows.length === 0) {
        // إذا لم يكن هناك تقييم سابق، أقم بإضافة تقييم جديد
        const result = await pool.query(
          'INSERT INTO stadium_reviews (stadium_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
          [stadium_id, user_id, rating, comment]
        );

        // حساب متوسط التقييم وتحديثه في جدول الاستعراضات
        await updateAverageRating(stadium_id);

        res.json({ message: 'Review added successfully', review: result.rows[0] });
      } else {
        // إذا كان هناك تقييم سابق، قم بتحديثه
        const result = await pool.query(
          'UPDATE stadium_reviews SET rating = $1, comment = $2 WHERE stadium_id = $3 AND user_id = $4 RETURNING *',
          [rating, comment, stadium_id, user_id]
        );

        // حساب متوسط التقييم وتحديثه في جدول الاستعراضات
        await updateAverageRating(stadium_id);

        res.json({ message: 'Review updated successfully', review: result.rows[0] });
      }
    } else {
      res.status(400).json({ message: 'Invalid rating. Rating must be between 1 and 5.' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// function for avg 
async function updateAverageRating(stadiumId) {
  try {
    const result = await pool.query(
      'UPDATE stadium_reviews SET average_rating = (SELECT AVG(rating) FROM stadium_reviews WHERE stadium_id = $1) WHERE stadium_id = $1',
      [stadiumId]
    );
  } catch (error) {
    console.error('Error updating average rating', error);
  }
}

// get reviwe and comments for stadium 
app.get('/stadium-reviews/:stadium_id', async (req, res) => {
  const stadiumId = req.params.stadium_id;

  try {
    const averageRatingResult = await pool.query(
      'SELECT AVG(rating) as average_rating FROM stadium_reviews WHERE stadium_id = $1',
      [stadiumId]
    );

    const averageRating = averageRatingResult.rows[0]?.average_rating || 0;

    const commentsResult = await pool.query(
      'SELECT * FROM stadium_reviews WHERE stadium_id = $1',
      [stadiumId]
    );

    const comments = commentsResult.rows;

    res.json({ averageRating, comments });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
});
/////////////////////////////////////////////////////////////////////////////
app.listen(2000, () => {
  console.log("server running at http://localhost:2000");
});
module.exports = app;