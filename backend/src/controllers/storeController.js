const { ShippingMethod, SystemConfig } = require('../models');

const PUBLIC_CONFIG_KEYS = [
  'shop_name',
  'shop_phone',
  'shop_email',
  'shop_address',
  'shop_description',
  'shop_logo',
  'facebook_url',
  'instagram_url',
  'tiktok_url',
  'return_policy',
  'shipping_policy',
  'warranty_policy'
];

const getShippingMethods = async (req, res) => {
  try {
    const methods = await ShippingMethod.findAll({
      where: { isActive: true },
      order: [['fee', 'ASC']]
    });
    res.json({ shippingMethods: methods, freeShippingThreshold: 500000 });
  } catch (error) {
    console.error('Lỗi lấy phương thức vận chuyển:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy phương thức vận chuyển' });
  }
};

const getPublicConfig = async (req, res) => {
  try {
    const configs = await SystemConfig.findAll({ where: { key: PUBLIC_CONFIG_KEYS } });
    const config = {};
    configs.forEach((item) => {
      config[item.key] = item.value;
    });
    res.json({ config });
  } catch (error) {
    console.error('Lỗi lấy cấu hình cửa hàng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy cấu hình cửa hàng' });
  }
};

module.exports = { getShippingMethods, getPublicConfig };
