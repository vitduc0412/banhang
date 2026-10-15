const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Product,
  ProductImage,
  ProductVariant,
  Category,
  Cart,
  Wishlist,
  Review,
  ProductView
} = require('../models');

const INTERACTION_WEIGHTS = {
  purchase: 5,
  cart: 3,
  wishlist: 3,
  view: 1,
  goodReview: 2,
  badReview: -4
};

const VIEW_DECAY_DAYS = 14;
const MAX_PER_CATEGORY = 3;

const clampLimit = (value, fallback = 8) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 24);
};

const getSessionId = (req) => {
  const raw = req.header('X-Session-Id') || req.query.sessionId || req.body?.sessionId;
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.trim().slice(0, 64);
  return /^[a-zA-Z0-9-]+$/.test(cleaned) ? cleaned : null;
};

const effectivePrice = (product) => {
  const sale = Number(product.salePrice);
  const price = Number(product.price);
  return sale && sale < price ? sale : price;
};

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFC')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 1);

const jaccard = (setA, setB) => {
  if (!setA.size || !setB.size) return 0;
  let intersection = 0;
  setA.forEach((item) => {
    if (setB.has(item)) intersection += 1;
  });
  return intersection / (setA.size + setB.size - intersection);
};

const loadCandidatePool = async () => {
  const products = await Product.findAll({
    where: { isActive: true },
    include: [
      { model: ProductImage, as: 'images', where: { isPrimary: true }, required: false },
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'parentId'] },
      { model: ProductVariant, as: 'variants', attributes: ['color', 'size', 'stock'] }
    ]
  });
  const categories = await Category.findAll({ attributes: ['id', 'name', 'parentId'], raw: true });
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  const brandCounts = new Map();
  products.forEach((product) => {
    if (product.brand) brandCounts.set(product.brand, (brandCounts.get(product.brand) || 0) + 1);
  });
  const isDistinctiveBrand = (brand) => Boolean(brand) && (brandCounts.get(brand) || 0) / products.length <= 0.6;

  return products.map((product) => {
    const json = product.toJSON();
    const inStock = (json.variants || []).some((variant) => variant.stock > 0);
    const groupId = json.category?.parentId || json.categoryId;
    return {
      product: json,
      groupId,
      groupName: categoryById.get(groupId)?.name || json.category?.name,
      distinctiveBrand: isDistinctiveBrand(json.brand) ? json.brand : null,
      inStock,
      price: effectivePrice(json),
      colors: new Set((json.variants || []).map((variant) => String(variant.color).toLowerCase())),
      tokens: new Set(tokenize(json.name))
    };
  });
};

const toPublicProduct = (entry, reason, score) => {
  const { variants, views, ...rest } = entry.product;
  return {
    ...rest,
    recommendation: {
      reason,
      score: Math.round(score * 1000) / 1000
    }
  };
};

const contentSimilarity = (base, candidate) => {
  const breakdown = { category: 0, brand: 0, material: 0, price: 0, color: 0, name: 0 };
  const baseProduct = base.product;
  const candidateProduct = candidate.product;

  if (baseProduct.categoryId === candidateProduct.categoryId) {
    breakdown.category = 0.35;
  } else if (base.groupId === candidate.groupId) {
    breakdown.category = 0.15;
  }

  if (base.distinctiveBrand && base.distinctiveBrand === candidate.distinctiveBrand) {
    breakdown.brand = 0.15;
  }

  if (baseProduct.material && baseProduct.material === candidateProduct.material) {
    breakdown.material = 0.1;
  }

  const maxPrice = Math.max(base.price, candidate.price) || 1;
  breakdown.price = 0.2 * Math.max(0, 1 - Math.abs(base.price - candidate.price) / maxPrice);
  breakdown.color = 0.1 * jaccard(base.colors, candidate.colors);
  breakdown.name = 0.1 * jaccard(base.tokens, candidate.tokens);

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  return { total, breakdown };
};

const popularityScore = (entry, maxSold) => {
  const sold = Number(entry.product.totalSold) || 0;
  const rating = Number(entry.product.avgRating) || 0;
  const soldScore = maxSold > 0 ? Math.log1p(sold) / Math.log1p(maxSold) : 0;
  return 0.6 * soldScore + 0.4 * (rating / 5);
};

const similarityReason = (breakdown, base) => {
  const baseProduct = base.product;
  const strongest = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0]?.[0];
  switch (strongest) {
    case 'category':
      return breakdown.category >= 0.35
        ? `Cùng dòng ${baseProduct.category?.name || 'sản phẩm'}`
        : `Cùng nhóm ${base.groupName || 'sản phẩm'}`;
    case 'brand':
      return `Cùng thương hiệu ${baseProduct.brand}`;
    case 'material':
      return `Cùng chất liệu ${baseProduct.material}`;
    case 'price':
      return 'Mức giá tương đương';
    case 'color':
      return 'Tông màu tương tự';
    default:
      return 'Phong cách tương tự';
  }
};

const diversify = (rankedEntries, limit) => {
  const result = [];
  const overflow = [];
  const categoryCount = {};

  rankedEntries.forEach((item) => {
    const categoryId = item.entry.product.categoryId;
    categoryCount[categoryId] = categoryCount[categoryId] || 0;
    if (categoryCount[categoryId] < MAX_PER_CATEGORY) {
      categoryCount[categoryId] += 1;
      result.push(item);
    } else {
      overflow.push(item);
    }
  });

  return [...result, ...overflow].slice(0, limit);
};

const getOrderCountsByProduct = async () => {
  const rows = await sequelize.query(
    `SELECT pv.productId AS productId, COUNT(DISTINCT oi.orderId) AS orderCount
     FROM order_items oi
     JOIN product_variants pv ON pv.id = oi.variantId
     JOIN orders o ON o.id = oi.orderId AND o.status <> 'cancelled'
     GROUP BY pv.productId`,
    { type: QueryTypes.SELECT }
  );
  const counts = new Map();
  rows.forEach((row) => counts.set(Number(row.productId), Number(row.orderCount)));
  return counts;
};

const getCoPurchaseScores = async (seedIds) => {
  if (!seedIds.length) return new Map();

  const rows = await sequelize.query(
    `SELECT pv2.productId AS productId, COUNT(DISTINCT oi2.orderId) AS together
     FROM order_items oi1
     JOIN product_variants pv1 ON pv1.id = oi1.variantId
     JOIN orders o ON o.id = oi1.orderId AND o.status <> 'cancelled'
     JOIN order_items oi2 ON oi2.orderId = oi1.orderId
     JOIN product_variants pv2 ON pv2.id = oi2.variantId
     WHERE pv1.productId IN (:seedIds) AND pv2.productId NOT IN (:seedIds)
     GROUP BY pv2.productId`,
    { replacements: { seedIds }, type: QueryTypes.SELECT }
  );

  if (!rows.length) return new Map();

  const orderCounts = await getOrderCountsByProduct();
  const seedOrderTotal = seedIds.reduce((sum, id) => sum + (orderCounts.get(id) || 0), 0) || 1;

  const scores = new Map();
  rows.forEach((row) => {
    const productId = Number(row.productId);
    const together = Number(row.together);
    const targetCount = orderCounts.get(productId) || together;
    scores.set(productId, together / Math.sqrt(seedOrderTotal * targetCount));
  });
  return scores;
};

const getCoViewScores = async (seedIds) => {
  if (!seedIds.length) return new Map();

  const rows = await sequelize.query(
    `SELECT v2.productId AS productId, COUNT(DISTINCT COALESCE(CONCAT('u', v1.userId), v1.sessionId)) AS viewers
     FROM product_views v1
     JOIN product_views v2
       ON COALESCE(CONCAT('u', v1.userId), v1.sessionId) = COALESCE(CONCAT('u', v2.userId), v2.sessionId)
     WHERE v1.productId IN (:seedIds) AND v2.productId NOT IN (:seedIds)
     GROUP BY v2.productId`,
    { replacements: { seedIds }, type: QueryTypes.SELECT }
  );

  if (!rows.length) return new Map();
  const maxViewers = Math.max(...rows.map((row) => Number(row.viewers)));
  const scores = new Map();
  rows.forEach((row) => scores.set(Number(row.productId), Number(row.viewers) / maxViewers));
  return scores;
};

const getViewerHistory = async (userId, sessionId) => {
  const conditions = [];
  if (userId) conditions.push({ userId });
  if (sessionId) conditions.push({ sessionId });
  if (!conditions.length) return [];

  return ProductView.findAll({
    where: { [Op.or]: conditions },
    attributes: ['productId', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: 200,
    raw: true
  });
};

const buildInteractionWeights = async (userId, sessionId) => {
  const weights = new Map();
  const excluded = new Set();
  const addWeight = (productId, value) => {
    const id = Number(productId);
    weights.set(id, (weights.get(id) || 0) + value);
  };

  const now = Date.now();
  const views = await getViewerHistory(userId, sessionId);
  views.forEach((view) => {
    const days = (now - new Date(view.createdAt).getTime()) / 86400000;
    addWeight(view.productId, INTERACTION_WEIGHTS.view * Math.exp(-days / VIEW_DECAY_DAYS));
  });

  if (userId) {
    const purchases = await sequelize.query(
      `SELECT pv.productId AS productId, SUM(oi.quantity) AS quantity
       FROM order_items oi
       JOIN product_variants pv ON pv.id = oi.variantId
       JOIN orders o ON o.id = oi.orderId AND o.status <> 'cancelled'
       WHERE o.userId = :userId
       GROUP BY pv.productId`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    purchases.forEach((row) => {
      addWeight(row.productId, INTERACTION_WEIGHTS.purchase);
      excluded.add(Number(row.productId));
    });

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: ProductVariant, as: 'variant', attributes: ['productId'] }]
    });
    cartItems.forEach((item) => {
      if (!item.variant) return;
      addWeight(item.variant.productId, INTERACTION_WEIGHTS.cart);
      excluded.add(Number(item.variant.productId));
    });

    const wishlists = await Wishlist.findAll({ where: { userId }, attributes: ['productId'], raw: true });
    wishlists.forEach((item) => addWeight(item.productId, INTERACTION_WEIGHTS.wishlist));

    const reviews = await Review.findAll({ where: { userId }, attributes: ['productId', 'rating'], raw: true });
    reviews.forEach((review) => {
      if (review.rating >= 4) addWeight(review.productId, INTERACTION_WEIGHTS.goodReview);
      if (review.rating <= 2) addWeight(review.productId, INTERACTION_WEIGHTS.badReview);
    });
  }

  return { weights, excluded };
};

const buildUserProfile = (weights, poolById) => {
  const profile = { categories: new Map(), brands: new Map(), materials: new Map(), colors: new Map(), priceSum: 0, priceWeight: 0 };
  const bump = (map, key, value) => {
    if (!key) return;
    map.set(key, (map.get(key) || 0) + value);
  };

  weights.forEach((weight, productId) => {
    const entry = poolById.get(productId);
    if (!entry || weight <= 0) return;
    bump(profile.categories, entry.product.categoryId, weight);
    bump(profile.brands, entry.distinctiveBrand, weight);
    bump(profile.materials, entry.product.material, weight);
    entry.colors.forEach((color) => bump(profile.colors, color, weight / Math.max(entry.colors.size, 1)));
    profile.priceSum += entry.price * weight;
    profile.priceWeight += weight;
  });

  const normalize = (map) => {
    const max = Math.max(0, ...map.values());
    if (max <= 0) return map;
    map.forEach((value, key) => map.set(key, value / max));
    return map;
  };

  normalize(profile.categories);
  normalize(profile.brands);
  normalize(profile.materials);
  normalize(profile.colors);
  profile.avgPrice = profile.priceWeight > 0 ? profile.priceSum / profile.priceWeight : null;
  return profile;
};

const profileMatch = (profile, entry) => {
  const breakdown = {
    category: 0.4 * (profile.categories.get(entry.product.categoryId) || 0),
    brand: 0.2 * (profile.brands.get(entry.distinctiveBrand) || 0),
    material: 0.1 * (profile.materials.get(entry.product.material) || 0),
    color: 0,
    price: 0
  };

  if (entry.colors.size) {
    let colorSum = 0;
    entry.colors.forEach((color) => {
      colorSum += profile.colors.get(color) || 0;
    });
    breakdown.color = 0.1 * Math.min(1, colorSum / entry.colors.size);
  }

  if (profile.avgPrice) {
    const maxPrice = Math.max(profile.avgPrice, entry.price) || 1;
    breakdown.price = 0.2 * Math.max(0, 1 - Math.abs(profile.avgPrice - entry.price) / maxPrice);
  }

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  return { total, breakdown };
};

const rankTrending = async (pool, limit, excludedIds = new Set()) => {
  const recentSales = await sequelize.query(
    `SELECT pv.productId AS productId, SUM(oi.quantity) AS quantity
     FROM order_items oi
     JOIN product_variants pv ON pv.id = oi.variantId
     JOIN orders o ON o.id = oi.orderId AND o.status <> 'cancelled'
     WHERE o.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     GROUP BY pv.productId`,
    { type: QueryTypes.SELECT }
  );
  const recentViews = await sequelize.query(
    `SELECT productId, COUNT(*) AS views
     FROM product_views
     WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
     GROUP BY productId`,
    { type: QueryTypes.SELECT }
  );

  const salesMap = new Map(recentSales.map((row) => [Number(row.productId), Number(row.quantity)]));
  const viewMap = new Map(recentViews.map((row) => [Number(row.productId), Number(row.views)]));
  const maxSales = Math.max(1, ...salesMap.values());
  const maxViews = Math.max(1, ...viewMap.values());
  const maxSold = Math.max(0, ...pool.map((entry) => Number(entry.product.totalSold) || 0));

  const ranked = pool
    .filter((entry) => entry.inStock && !excludedIds.has(entry.product.id))
    .map((entry) => {
      const sales = (salesMap.get(entry.product.id) || 0) / maxSales;
      const views = (viewMap.get(entry.product.id) || 0) / maxViews;
      const score = 0.45 * sales + 0.25 * views + 0.3 * popularityScore(entry, maxSold);
      let reason = 'Được nhiều khách hàng yêu thích';
      if (sales > 0.5) reason = 'Bán chạy trong 30 ngày qua';
      else if (views > 0.5) reason = 'Đang được xem nhiều';
      else if (Number(entry.product.avgRating) >= 4.5) reason = 'Được đánh giá cao';
      return { entry, score, reason };
    })
    .sort((a, b) => b.score - a.score);

  return diversify(ranked, limit);
};

const getSimilar = async (req, res) => {
  try {
    const limit = clampLimit(req.query.limit);
    const pool = await loadCandidatePool();
    const baseId = Number(req.params.productId);
    const base = pool.find((entry) => entry.product.id === baseId || entry.product.slug === req.params.productId);

    if (!base) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const maxSold = Math.max(0, ...pool.map((entry) => Number(entry.product.totalSold) || 0));
    const ranked = pool
      .filter((entry) => entry.product.id !== base.product.id && entry.inStock)
      .map((entry) => {
        const similarity = contentSimilarity(base, entry);
        const score = 0.9 * similarity.total + 0.1 * popularityScore(entry, maxSold);
        return { entry, score, reason: similarityReason(similarity.breakdown, base) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.json({
      strategy: 'content-based',
      products: ranked.map((item) => toPublicProduct(item.entry, item.reason, item.score))
    });
  } catch (error) {
    console.error('Lỗi gợi ý sản phẩm tương tự:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy sản phẩm tương tự' });
  }
};

const rankByCollaboration = async (pool, seedIds, excludedIds, limit) => {
  const [coPurchase, coView] = await Promise.all([getCoPurchaseScores(seedIds), getCoViewScores(seedIds)]);
  const ranked = pool
    .filter((entry) => entry.inStock && !excludedIds.has(entry.product.id))
    .map((entry) => {
      const purchaseScore = coPurchase.get(entry.product.id) || 0;
      const viewScore = coView.get(entry.product.id) || 0;
      const score = 0.7 * purchaseScore + 0.3 * viewScore;
      const reason = purchaseScore > 0 ? 'Thường được mua cùng' : 'Khách xem sản phẩm này cũng xem';
      return { entry, score, reason };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit);
};

const getBoughtTogether = async (req, res) => {
  try {
    const limit = clampLimit(req.query.limit, 4);
    const pool = await loadCandidatePool();
    const base = pool.find(
      (entry) => entry.product.id === Number(req.params.productId) || entry.product.slug === req.params.productId
    );

    if (!base) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const excluded = new Set([base.product.id]);
    let ranked = await rankByCollaboration(pool, [base.product.id], excluded, limit);
    let strategy = 'item-based-collaborative';

    if (ranked.length < limit) {
      ranked.forEach((item) => excluded.add(item.entry.product.id));
      const complementary = pool
        .filter(
          (entry) =>
            entry.inStock &&
            !excluded.has(entry.product.id) &&
            entry.groupId !== base.groupId
        )
        .map((entry) => {
          const similarity = contentSimilarity(base, entry);
          return { entry, score: similarity.total * 0.5, reason: `Phối cùng ${entry.groupName?.toLowerCase() || 'sản phẩm khác'}` };
        })
        .sort((a, b) => b.score - a.score);
      ranked = [...ranked, ...diversify(complementary, limit - ranked.length)];
      strategy = ranked.some((item) => item.reason === 'Thường được mua cùng') ? 'hybrid' : 'complementary-fallback';
    }

    res.json({
      strategy,
      products: ranked.map((item) => toPublicProduct(item.entry, item.reason, item.score))
    });
  } catch (error) {
    console.error('Lỗi gợi ý mua kèm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy sản phẩm mua kèm' });
  }
};

const getForYou = async (req, res) => {
  try {
    const limit = clampLimit(req.query.limit);
    const userId = req.user?.id || null;
    const sessionId = getSessionId(req);
    const pool = await loadCandidatePool();
    const poolById = new Map(pool.map((entry) => [entry.product.id, entry]));

    const { weights, excluded } = await buildInteractionWeights(userId, sessionId);
    const positiveSeeds = [...weights.entries()]
      .filter(([productId, weight]) => weight > 0 && poolById.has(productId))
      .sort((a, b) => b[1] - a[1]);

    if (!positiveSeeds.length) {
      const trending = await rankTrending(pool, limit);
      return res.json({
        strategy: 'trending',
        personalized: false,
        products: trending.map((item) => toPublicProduct(item.entry, item.reason, item.score))
      });
    }

    const profile = buildUserProfile(weights, poolById);
    const seedIds = positiveSeeds.slice(0, 10).map(([productId]) => productId);
    const [coPurchase, coView] = await Promise.all([getCoPurchaseScores(seedIds), getCoViewScores(seedIds)]);
    const maxCoPurchase = Math.max(0, ...coPurchase.values()) || 1;
    const maxSold = Math.max(0, ...pool.map((entry) => Number(entry.product.totalSold) || 0));
    const recentlyViewed = new Set(positiveSeeds.slice(0, 3).map(([productId]) => productId));
    const topSeed = poolById.get(seedIds[0]);

    const categoryNames = new Map(pool.map((entry) => [entry.product.categoryId, entry.product.category?.name]));

    const ranked = pool
      .filter((entry) => entry.inStock && !excluded.has(entry.product.id) && !recentlyViewed.has(entry.product.id))
      .map((entry) => {
        const content = profileMatch(profile, entry);
        const collaborative =
          0.7 * ((coPurchase.get(entry.product.id) || 0) / maxCoPurchase) + 0.3 * (coView.get(entry.product.id) || 0);
        const popularity = popularityScore(entry, maxSold);
        const score = 0.5 * content.total + 0.35 * collaborative + 0.15 * popularity;

        let reason;
        if (collaborative >= 0.3 && collaborative * 0.35 >= content.total * 0.5 * 0.6) {
          reason = 'Khách hàng có sở thích giống bạn cũng chọn';
        } else if (content.breakdown.brand >= 0.15 && entry.product.brand) {
          reason = `Thương hiệu ${entry.product.brand} bạn quan tâm`;
        } else if (content.breakdown.category >= 0.3) {
          reason = `Vì bạn quan tâm đến ${categoryNames.get(entry.product.categoryId) || 'danh mục này'}`;
        } else if (topSeed && contentSimilarity(topSeed, entry).total >= 0.5) {
          reason = `Vì bạn đã xem ${topSeed.product.name}`;
        } else if (content.breakdown.price >= 0.17) {
          reason = 'Phù hợp với mức giá bạn hay chọn';
        } else {
          reason = 'Có thể bạn sẽ thích';
        }
        return { entry, score, reason };
      })
      .sort((a, b) => b.score - a.score);

    res.json({
      strategy: 'hybrid',
      personalized: true,
      products: diversify(ranked, limit).map((item) => toPublicProduct(item.entry, item.reason, item.score))
    });
  } catch (error) {
    console.error('Lỗi gợi ý cá nhân hóa:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy gợi ý dành cho bạn' });
  }
};

const getForCart = async (req, res) => {
  try {
    const limit = clampLimit(req.query.limit, 4);
    const pool = await loadCandidatePool();
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: ProductVariant, as: 'variant', attributes: ['productId'] }]
    });
    const seedIds = [...new Set(cartItems.filter((item) => item.variant).map((item) => item.variant.productId))];
    const excluded = new Set(seedIds);

    if (!seedIds.length) {
      const trending = await rankTrending(pool, limit);
      return res.json({
        strategy: 'trending',
        products: trending.map((item) => toPublicProduct(item.entry, item.reason, item.score))
      });
    }

    let ranked = await rankByCollaboration(pool, seedIds, excluded, limit);

    if (ranked.length < limit) {
      ranked.forEach((item) => excluded.add(item.entry.product.id));
      const seeds = seedIds.map((id) => pool.find((entry) => entry.product.id === id)).filter(Boolean);
      const cartGroups = new Set(seeds.map((seed) => seed.groupId));
      const complementary = pool
        .filter((entry) => entry.inStock && !excluded.has(entry.product.id))
        .map((entry) => {
          const best = Math.max(...seeds.map((seed) => contentSimilarity(seed, entry).total));
          const isComplementary = !cartGroups.has(entry.groupId);
          return {
            entry,
            score: 0.6 * best + (isComplementary ? 0.15 : 0),
            reason: isComplementary ? `Phối cùng ${entry.groupName?.toLowerCase() || 'sản phẩm khác'}` : 'Phong cách tương tự'
          };
        })
        .sort((a, b) => b.score - a.score);
      ranked = [...ranked, ...diversify(complementary, limit - ranked.length)];
    }

    res.json({
      strategy: 'cart-based',
      products: ranked.map((item) => toPublicProduct(item.entry, item.reason, item.score))
    });
  } catch (error) {
    console.error('Lỗi gợi ý theo giỏ hàng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy gợi ý theo giỏ hàng' });
  }
};

const getTrending = async (req, res) => {
  try {
    const limit = clampLimit(req.query.limit);
    const pool = await loadCandidatePool();
    const trending = await rankTrending(pool, limit);
    res.json({
      strategy: 'trending',
      products: trending.map((item) => toPublicProduct(item.entry, item.reason, item.score))
    });
  } catch (error) {
    console.error('Lỗi lấy sản phẩm xu hướng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy sản phẩm xu hướng' });
  }
};

const getRecentlyViewed = async (req, res) => {
  try {
    const limit = clampLimit(req.query.limit);
    const excludeId = Number(req.query.exclude) || null;
    const history = await getViewerHistory(req.user?.id || null, getSessionId(req));
    const orderedIds = [];
    history.forEach((view) => {
      if (view.productId !== excludeId && !orderedIds.includes(view.productId)) {
        orderedIds.push(view.productId);
      }
    });
    const ids = orderedIds.slice(0, limit);

    if (!ids.length) {
      return res.json({ products: [] });
    }

    const products = await Product.findAll({
      where: { id: ids, isActive: true },
      include: [
        { model: ProductImage, as: 'images', where: { isPrimary: true }, required: false },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ]
    });
    const byId = new Map(products.map((product) => [product.id, product]));

    res.json({ products: ids.map((id) => byId.get(id)).filter(Boolean) });
  } catch (error) {
    console.error('Lỗi lấy sản phẩm đã xem:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy sản phẩm đã xem' });
  }
};

const trackView = async (req, res) => {
  try {
    const productId = Number(req.body.productId);
    const userId = req.user?.id || null;
    const sessionId = getSessionId(req);

    if (!productId) {
      return res.status(400).json({ message: 'Thiếu mã sản phẩm' });
    }
    if (!userId && !sessionId) {
      return res.status(400).json({ message: 'Không xác định được người xem' });
    }

    const product = await Product.findByPk(productId, { attributes: ['id'] });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (userId && sessionId) {
      await ProductView.update({ userId }, { where: { sessionId, userId: null } });
    }

    const lastView = await ProductView.findOne({
      where: { productId, ...(userId ? { userId } : { sessionId }) },
      order: [['createdAt', 'DESC']]
    });
    const thirtyMinutes = 30 * 60 * 1000;
    if (lastView && Date.now() - new Date(lastView.createdAt).getTime() < thirtyMinutes) {
      return res.json({ message: 'Đã ghi nhận lượt xem', tracked: false });
    }

    await ProductView.create({ productId, userId, sessionId });
    res.status(201).json({ message: 'Đã ghi nhận lượt xem', tracked: true });
  } catch (error) {
    console.error('Lỗi ghi nhận lượt xem:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi ghi nhận lượt xem' });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const [summary] = await sequelize.query(
      `SELECT COUNT(*) AS totalViews,
              COUNT(DISTINCT COALESCE(CONCAT('u', userId), sessionId)) AS totalViewers,
              SUM(createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS viewsLast7Days
       FROM product_views`,
      { type: QueryTypes.SELECT }
    );

    const mostViewed = await sequelize.query(
      `SELECT p.id, p.name, p.slug, COUNT(v.id) AS views,
              (SELECT COUNT(DISTINCT oi.orderId)
               FROM order_items oi
               JOIN product_variants pv ON pv.id = oi.variantId
               JOIN orders o ON o.id = oi.orderId AND o.status <> 'cancelled'
               WHERE pv.productId = p.id) AS orders
       FROM product_views v
       JOIN products p ON p.id = v.productId
       GROUP BY p.id, p.name, p.slug
       ORDER BY views DESC
       LIMIT 10`,
      { type: QueryTypes.SELECT }
    );

    const topPairs = await sequelize.query(
      `SELECT p1.name AS productA, p2.name AS productB, COUNT(DISTINCT oi1.orderId) AS orders
       FROM order_items oi1
       JOIN product_variants pv1 ON pv1.id = oi1.variantId
       JOIN order_items oi2 ON oi2.orderId = oi1.orderId
       JOIN product_variants pv2 ON pv2.id = oi2.variantId AND pv2.productId > pv1.productId
       JOIN orders o ON o.id = oi1.orderId AND o.status <> 'cancelled'
       JOIN products p1 ON p1.id = pv1.productId
       JOIN products p2 ON p2.id = pv2.productId
       GROUP BY p1.id, p2.id, p1.name, p2.name
       ORDER BY orders DESC
       LIMIT 10`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      summary: {
        totalViews: Number(summary.totalViews) || 0,
        totalViewers: Number(summary.totalViewers) || 0,
        viewsLast7Days: Number(summary.viewsLast7Days) || 0
      },
      mostViewed: mostViewed.map((row) => ({
        ...row,
        views: Number(row.views),
        orders: Number(row.orders)
      })),
      topPairs: topPairs.map((row) => ({ ...row, orders: Number(row.orders) }))
    });
  } catch (error) {
    console.error('Lỗi thống kê gợi ý:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thống kê gợi ý' });
  }
};

module.exports = {
  getSimilar,
  getBoughtTogether,
  getForYou,
  getForCart,
  getTrending,
  getRecentlyViewed,
  trackView,
  getAdminStats
};
