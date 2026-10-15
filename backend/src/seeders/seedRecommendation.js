require('dotenv').config();
const {
  sequelize,
  User,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
  Wishlist,
  ProductView
} = require('../models');

const DAY = 86400000;

const customers = [
  {
    fullName: 'Lê Minh Anh',
    email: 'minhanh.le@gmail.com',
    phone: '0912345678',
    address: '45 Trần Hưng Đạo, Phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh',
    outfits: [[2, 5], [7, 5], [2, 4]],
    browsing: [2, 5, 7, 3, 11],
    wishlist: [3]
  },
  {
    fullName: 'Phạm Quốc Huy',
    email: 'quochuy.pham@gmail.com',
    phone: '0987654321',
    address: '12 Nguyễn Chí Thanh, Phường Láng Thượng, Quận Đống Đa, Hà Nội',
    outfits: [[1, 4], [3, 4, 1], [9, 12]],
    browsing: [1, 4, 3, 9, 12, 7]
  },
  {
    fullName: 'Hoàng Thu Trang',
    email: 'thutrang.hoang@gmail.com',
    phone: '0903112233',
    address: '78 Lê Lợi, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
    outfits: [[6, 8], [10, 8]],
    browsing: [6, 8, 10, 11],
    wishlist: [10]
  },
  {
    fullName: 'Đỗ Gia Bảo',
    email: 'giabao.do@gmail.com',
    phone: '0938765432',
    address: '210 Võ Văn Ngân, Phường Bình Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',
    outfits: [[9, 12], [1, 12], [9, 4]],
    browsing: [9, 12, 1, 4, 3]
  },
  {
    fullName: 'Vũ Ngọc Lan',
    email: 'ngoclan.vu@gmail.com',
    phone: '0976543210',
    address: '5 Hai Bà Trưng, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    outfits: [[10, 11], [6, 8], [10, 8, 11]],
    browsing: [10, 11, 6, 8],
    wishlist: [6]
  },
  {
    fullName: 'Bùi Đức Thắng',
    email: 'ducthang.bui@gmail.com',
    phone: '0965432109',
    address: '33 Lý Thường Kiệt, Phường Hưng Bình, TP. Vinh, Nghệ An',
    outfits: [[2, 5], [11, 5], [7, 4]],
    browsing: [2, 11, 5, 7, 4]
  },
  {
    fullName: 'Ngô Khánh Linh',
    email: 'khanhlinh.ngo@gmail.com',
    phone: '0918223344',
    address: '88 Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều, Cần Thơ',
    outfits: [[6, 8], [11, 12]],
    browsing: [6, 8, 11, 10, 12],
    wishlist: [8]
  },
  {
    fullName: 'Trịnh Hải Nam',
    email: 'hainam.trinh@gmail.com',
    phone: '0909887766',
    address: '150 Lạch Tray, Phường Đằng Giang, Quận Ngô Quyền, Hải Phòng',
    outfits: [[3, 4], [1, 4], [9, 12, 1]],
    browsing: [3, 4, 1, 9]
  }
];

const guestSessions = [
  { sessionId: 'guest-seed-congso', products: [2, 5, 7, 10] },
  { sessionId: 'guest-seed-daopho', products: [1, 4, 9, 12] },
  { sessionId: 'guest-seed-nutinh', products: [6, 8, 10, 11] },
  { sessionId: 'guest-seed-mua-he', products: [11, 12, 1, 8] }
];

const setCreatedAt = (table, id, date) =>
  sequelize.query(`UPDATE ${table} SET createdAt = :date${table === 'product_views' ? '' : ', updatedAt = :date'} WHERE id = :id`, {
    replacements: { date, id }
  });

const pickVariant = (variants, seed) => {
  const available = variants.filter((variant) => variant.stock > 0);
  return available[seed % available.length] || variants[0];
};

const seedRecommendation = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const products = await Product.findAll({
    where: { isActive: true },
    include: [
      { model: ProductVariant, as: 'variants' },
      { model: ProductImage, as: 'images', where: { isPrimary: true }, required: false }
    ]
  });
  const productById = new Map(products.map((product) => [product.id, product]));

  let orderCount = 0;
  let viewCount = 0;
  const now = Date.now();

  for (const [customerIndex, customer] of customers.entries()) {
    const [user] = await User.findOrCreate({
      where: { email: customer.email },
      defaults: {
        fullName: customer.fullName,
        email: customer.email,
        password: '123456',
        phone: customer.phone,
        role: 'customer'
      }
    });

    for (const [outfitIndex, outfit] of customer.outfits.entries()) {
      const orderCode = `VSR${String(customerIndex + 1).padStart(2, '0')}${String(outfitIndex + 1).padStart(2, '0')}`;
      const existed = await Order.findOne({ where: { orderCode } });
      if (existed) continue;

      const items = outfit
        .map((productId, itemIndex) => {
          const product = productById.get(productId);
          if (!product || !product.variants.length) return null;
          const variant = pickVariant(product.variants, customerIndex + itemIndex);
          const price = Number(product.salePrice) && Number(product.salePrice) < Number(product.price)
            ? Number(product.salePrice)
            : Number(product.price);
          return {
            variantId: variant.id,
            productName: product.name,
            size: variant.size,
            color: variant.color,
            price,
            quantity: 1,
            image: product.images?.[0]?.url || null
          };
        })
        .filter(Boolean);

      if (!items.length) continue;

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingFee = subtotal >= 500000 ? 0 : 30000;
      const orderDate = new Date(now - (50 - customerIndex * 4 - outfitIndex * 9) * DAY);

      const order = await Order.create({
        orderCode,
        userId: user.id,
        fullName: customer.fullName,
        phone: customer.phone,
        address: customer.address,
        subtotal,
        shippingFee,
        discount: 0,
        total: subtotal + shippingFee,
        paymentMethod: outfitIndex % 2 === 0 ? 'cod' : 'vnpay',
        paymentStatus: 'paid',
        status: 'delivered'
      });
      await OrderItem.bulkCreate(items.map((item) => ({ ...item, orderId: order.id })));
      await setCreatedAt('orders', order.id, orderDate);
      orderCount += 1;
    }

    const existingViews = await ProductView.count({ where: { userId: user.id } });
    if (!existingViews) {
      for (const [viewIndex, productId] of customer.browsing.entries()) {
        if (!productById.has(productId)) continue;
        const view = await ProductView.create({ userId: user.id, productId });
        await setCreatedAt('product_views', view.id, new Date(now - (viewIndex * 2 + customerIndex) * DAY - viewIndex * 3600000));
        viewCount += 1;
      }
    }

    for (const productId of customer.wishlist || []) {
      if (!productById.has(productId)) continue;
      await Wishlist.findOrCreate({ where: { userId: user.id, productId } });
    }
  }

  for (const [sessionIndex, guest] of guestSessions.entries()) {
    const existingViews = await ProductView.count({ where: { sessionId: guest.sessionId } });
    if (existingViews) continue;
    for (const [viewIndex, productId] of guest.products.entries()) {
      if (!productById.has(productId)) continue;
      const view = await ProductView.create({ sessionId: guest.sessionId, productId });
      await setCreatedAt('product_views', view.id, new Date(now - (sessionIndex + viewIndex) * DAY));
      viewCount += 1;
    }
  }

  console.log(`Đã tạo ${orderCount} đơn hàng mẫu và ${viewCount} lượt xem cho hệ thống gợi ý`);
};

seedRecommendation()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Lỗi seed dữ liệu gợi ý:', error);
    process.exit(1);
  });
