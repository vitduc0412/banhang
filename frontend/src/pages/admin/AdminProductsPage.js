import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiImage, FiDownload } from 'react-icons/fi';
import { exportCsv } from '../../utils/exportFile';
import { adminAPI } from '../../api';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-toastify';
import './AdminProductsPage.css';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await adminAPI.getProducts({ page: 1, limit: 10000 });
      const list = res.products || [];
      exportCsv(`san-pham-${new Date().toISOString().slice(0, 10)}.csv`, [
        { label: 'ID', value: 'id' },
        { label: 'Tên sản phẩm', value: 'name' },
        { label: 'Danh mục', value: (row) => row.category?.name },
        { label: 'Thương hiệu', value: 'brand' },
        { label: 'Chất liệu', value: 'material' },
        { label: 'Giá gốc', value: (row) => Number(row.price) },
        { label: 'Giá khuyến mãi', value: (row) => (row.salePrice ? Number(row.salePrice) : '') },
        { label: 'Tồn kho', value: (row) => (row.variants || []).reduce((sum, variant) => sum + variant.stock, 0) },
        { label: 'Biến thể', value: (row) => (row.variants || []).map((variant) => `${variant.size}/${variant.color}: ${variant.stock}`).join('; ') },
        { label: 'Đã bán', value: 'totalSold' },
        { label: 'Đánh giá TB', value: 'avgRating' },
        { label: 'Trạng thái', value: (row) => (row.isActive ? 'Đang bán' : 'Ngừng bán') },
      ], list);
      toast.success(`Đã xuất ${list.length} sản phẩm`);
    } catch (err) {
      toast.error(err.message || 'Không thể xuất danh sách sản phẩm');
    } finally {
      setExporting(false);
    }
  };
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getProducts({ page, limit: 10, search });
      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminAPI.deleteProduct(deleteId);
      toast.success('Xóa sản phẩm thành công');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error('Xóa sản phẩm thất bại');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="admin-products-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý sản phẩm</h1>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={handleExport} disabled={exporting}>
            <FiDownload /> {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </button>
          <button className="btn-primary" onClick={() => navigate('/admin/san-pham/tao-moi')}>
            <FiPlus /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <form onSubmit={handleSearch} className="search-form">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="clear-search" onClick={() => { setSearch(''); setPage(1); }}>
              <FiX />
            </button>
          )}
        </form>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-text">Không có sản phẩm nào</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.images?.[0]?.url ? (
                      <img src={p.images[0].url} alt={p.name} className="product-thumb" />
                    ) : (
                      <div className="product-thumb-empty"><FiImage /></div>
                    )}
                  </td>
                  <td className="product-name-cell">{p.name}</td>
                  <td>{p.category?.name || 'Chưa phân loại'}</td>
                  <td>
                    {p.salePrice ? (
                      <div>
                        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{formatPrice(p.salePrice)}</span>
                        <br />
                        <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatPrice(p.price)}</span>
                      </div>
                    ) : (
                      formatPrice(p.price)
                    )}
                  </td>
                  <td>{p.variants ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : '---'}</td>
                  <td>
                    <span className={`product-status status-${p.isActive === false ? 'inactive' : 'active'}`}>
                      {p.isActive === false ? 'Ẩn' : 'Đang bán'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon btn-edit" onClick={() => navigate(`/admin/san-pham/${p.id}`)} title="Sửa">
                        <FiEdit2 />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => setDeleteId(p.id)} title="Xóa">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Trước</button>
          <span>Trang {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Sau</button>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Xác nhận xóa</h2>
              <button className="modal-close" onClick={() => setDeleteId(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-actions" style={{ padding: '0 20px 20px' }}>
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Hủy</button>
              <button className="btn-danger" onClick={handleDelete}>Xóa sản phẩm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
