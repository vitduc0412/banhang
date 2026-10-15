import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import './AdminExtra.css';

const ALGORITHMS = [
  {
    tag: 'Content-based',
    title: 'Sản phẩm tương tự',
    description:
      'So khớp danh mục, nhóm danh mục cha, chất liệu, thương hiệu, độ gần về giá, màu sắc và từ khóa trong tên sản phẩm. Hiển thị ở trang chi tiết sản phẩm.'
  },
  {
    tag: 'Item-based collaborative',
    title: 'Thường được mua cùng',
    description:
      'Đếm số đơn hàng (không tính đơn đã hủy) chứa đồng thời hai sản phẩm, chuẩn hóa theo độ tương đồng cosine và kết hợp với hành vi cùng xem. Khi chưa đủ dữ liệu sẽ gợi ý món phối đồ khác nhóm.'
  },
  {
    tag: 'Hybrid',
    title: 'Gợi ý dành cho bạn',
    description:
      'Xây dựng hồ sơ sở thích từ lượt xem (giảm dần theo thời gian), giỏ hàng, yêu thích, đơn hàng và đánh giá. Điểm cuối = 50% nội dung + 35% cộng tác + 15% độ phổ biến, giới hạn tối đa 3 sản phẩm mỗi danh mục để đa dạng.'
  },
  {
    tag: 'Cold start',
    title: 'Xu hướng',
    description:
      'Khách mới chưa có lịch sử nhận danh sách xu hướng: doanh số 30 ngày, lượt xem 7 ngày, tổng đã bán và điểm đánh giá trung bình.'
  }
];

const WEIGHTS = [
  { label: 'Mua hàng', value: '+5' },
  { label: 'Thêm giỏ hàng', value: '+3' },
  { label: 'Yêu thích', value: '+3' },
  { label: 'Đánh giá 4-5 sao', value: '+2' },
  { label: 'Lượt xem', value: '+1 (giảm theo 14 ngày)' },
  { label: 'Đánh giá 1-2 sao', value: '-4' }
];

const AdminRecommendationsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.getRecommendationStats()
      .then((res) => setStats(res))
      .catch((err) => setError(err.message || 'Không thể tải thống kê gợi ý'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-extra-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gợi ý sản phẩm thông minh</h1>
          <p className="page-desc">Theo dõi dữ liệu hành vi mà hệ thống dùng để cá nhân hóa gợi ý cho khách hàng</p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {stats && (
        <>
          <div className="extra-stats">
            <div className="extra-stat">
              <div className="extra-stat__label">Tổng lượt xem được ghi nhận</div>
              <div className="extra-stat__value">{stats.summary.totalViews.toLocaleString('vi-VN')}</div>
            </div>
            <div className="extra-stat">
              <div className="extra-stat__label">Người xem khác nhau</div>
              <div className="extra-stat__value">{stats.summary.totalViewers.toLocaleString('vi-VN')}</div>
            </div>
            <div className="extra-stat">
              <div className="extra-stat__label">Lượt xem 7 ngày qua</div>
              <div className="extra-stat__value">{stats.summary.viewsLast7Days.toLocaleString('vi-VN')}</div>
            </div>
          </div>

          <div className="extra-grid">
            <div className="extra-card">
              <div className="extra-card__head">
                <h2>Sản phẩm được xem nhiều nhất</h2>
                <p>So sánh lượt xem với số đơn hàng thực tế</p>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Sản phẩm</th>
                      <th>Lượt xem</th>
                      <th>Số đơn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.mostViewed.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty-text">Chưa có dữ liệu lượt xem</td>
                      </tr>
                    ) : (
                      stats.mostViewed.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            <Link to={`/san-pham/${item.slug}`} target="_blank">{item.name}</Link>
                          </td>
                          <td>{item.views}</td>
                          <td>{item.orders}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="extra-card">
              <div className="extra-card__head">
                <h2>Cặp sản phẩm hay được mua cùng</h2>
                <p>Nguồn dữ liệu cho khối "Thường được mua cùng"</p>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cặp sản phẩm</th>
                      <th>Số đơn chung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topPairs.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="empty-text">Chưa có đơn hàng nhiều sản phẩm</td>
                      </tr>
                    ) : (
                      stats.topPairs.map((pair) => (
                        <tr key={`${pair.productA}-${pair.productB}`}>
                          <td>
                            <div className="pair-cell">
                              <span>{pair.productA}</span>
                              <small>+ {pair.productB}</small>
                            </div>
                          </td>
                          <td>{pair.orders}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="extra-card">
        <div className="extra-card__head">
          <h2>Cơ chế gợi ý đang áp dụng</h2>
          <p>Kết hợp lọc theo nội dung và lọc cộng tác (hybrid recommender)</p>
        </div>
        <div className="extra-card__body">
          <div className="algo-list">
            {ALGORITHMS.map((algo) => (
              <div className="algo-item" key={algo.title}>
                <span>{algo.tag}</span>
                <h3>{algo.title}</h3>
                <p>{algo.description}</p>
              </div>
            ))}
          </div>
          <div className="weight-list">
            {WEIGHTS.map((weight) => (
              <span className="weight-chip" key={weight.label}>
                {weight.label}: <strong>{weight.value}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRecommendationsPage;
