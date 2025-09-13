// seed.js - Seed admin user + demo products
// Usage: MONGODB_URI='mongodb://localhost:27017/expresscart' node seed.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expresscart';
const dbName = uri.split('/').pop().split('?')[0];

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const adminPass  = process.env.SEED_ADMIN_PASS  || 'password';

const demoProducts = [
  { productPermalink: "blue-tshirt", productTitle: "Blue T-Shirt", productPrice: 15.99, productPublished: true, productDescription: "100% cotton, classic fit", productStock: 50 },
  { productPermalink: "red-mug",     productTitle: "Red Coffee Mug", productPrice: 9.99,  productPublished: true, productDescription: "Ceramic mug", productStock: 100 },
  { productPermalink: "black-cap",   productTitle: "Black Cap", productPrice: 12.50, productPublished: true, productDescription: "Adjustable size", productStock: 30 },
  { productPermalink: "sticker-pack",productTitle: "Sticker Pack", productPrice: 4.00, productPublished: true, productDescription: "10 vinyl stickers", productStock: 200 },
  { productPermalink: "hoodie-gray", productTitle: "Gray Hoodie", productPrice: 29.90, productPublished: true, productDescription: "Fleece lined", productStock: 25 },
  { productPermalink: "water-bottle",productTitle: "Water Bottle", productPrice: 11.90, productPublished: true, productDescription: "BPA-free 600ml", productStock: 60 },
  { productPermalink: "notebook",    productTitle: "Notebook A5", productPrice: 5.50, productPublished: true, productDescription: "80 pages", productStock: 120 },
  { productPermalink: "pen-blue",    productTitle: "Blue Pen", productPrice: 1.20, productPublished: true, productDescription: "0.5mm gel pen", productStock: 300 },
  { productPermalink: "socks",       productTitle: "Comfy Socks", productPrice: 6.90, productPublished: true, productDescription: "Pair, cotton blend", productStock: 80 },
  { productPermalink: "phone-stand", productTitle: "Phone Stand", productPrice: 7.99, productPublished: true, productDescription: "Desk holder", productStock: 70 }
];

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // USERS
    const users = db.collection('users');
    const existing = await users.findOne({ userEmail: adminEmail });
    if (!existing) {
      const hash = await bcrypt.hash(adminPass, 10);
      await users.insertOne({
        userEmail: adminEmail,
        userPassword: hash,
        isAdmin: true,
        userCreated: new Date()
      });
      console.log(`✔ Created admin ${adminEmail} / ${adminPass}`);
    } else {
      console.log(`ℹ Admin ${adminEmail} already exists`);
    }

    // PRODUCTS
    const productsCol = db.collection('products');
    const count = await productsCol.countDocuments();
    if (count === 0) {
      await productsCol.insertMany(demoProducts.map(p => ({
        ...p,
        productTags: [],
        productAddedDate: new Date()
      })));
      console.log(`✔ Inserted ${demoProducts.length} demo products`);
    } else {
      console.log(`ℹ Products collection already has ${count} docs; skipping insert`);
    }

    console.log('✅ Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
})();
