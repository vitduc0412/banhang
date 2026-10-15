import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram } from 'react-icons/fi';
import { categoryAPI, storeAPI } from '../../api';
import './Footer.css';

const DEFAULT_CONFIG = {
  shop_description: 'Thời trang chất lượng cao với phong cách hiện đại, mang đến trải nghiệm mua sắm tuyệt vời cho bạn.',
  shop_address: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
  shop_phone: '0901 234 567',
  shop_email: 'contact@velvetstore.vn'
};

const Footer = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    storeAPI.getConfig()
      .then((res) => setConfig({ ...DEFAULT_CONFIG, ...(res.config || {}) }))
      .catch(() => {});
    categoryAPI.getAll()
      .then((res) => setCategories((res.categories || []).filter((cat) => !cat.parentId && cat.isActive !== false)))
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              {config.shop_logo ? (
                <img src={config.shop_logo} alt={config.shop_name || 'VelvetStore'} className="footer-logo-img" />
              ) : (
                <>
                  <span className="logo-text">VELVET</span>
                  <span className="logo-accent">STORE</span>
                </>
              )}
            </div>
            <p className="footer-desc">{config.shop_description}</p>
            {(config.facebook_url || config.instagram_url) && (
              <div className="footer-social">
                {config.facebook_url && (
                  <a href={config.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook">
                    <FiFacebook size={18} />
                  </a>
                )}
                {config.instagram_url && (
                  <a href={config.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <FiInstagram size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="footer-col">
            <h4>Danh mục</h4>
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat.id} to={`/san-pham?categoryId=${cat.id}`}>{cat.name}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <Link to="/chinh-sach">Chính sách đổi trả</Link>
            <Link to="/chinh-sach">Chính sách vận chuyển</Link>
            <Link to="/chinh-sach">Chính sách bảo hành</Link>
            <Link to="/lien-he">Liên hệ</Link>
          </div>

          <div className="footer-col">
            <h4>Liên hệ</h4>
            <div className="footer-contact">
              <FiMapPin size={16} />
              <span>{config.shop_address}</span>
            </div>
            <div className="footer-contact">
              <FiPhone size={16} />
              <span>{config.shop_phone}</span>
            </div>
            <div className="footer-contact">
              <FiMail size={16} />
              <span>{config.shop_email}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {config.shop_name || 'VelvetStore'}. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
