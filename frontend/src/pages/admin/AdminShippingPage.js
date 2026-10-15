import { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api';
import { formatPrice } from '../../utils/formatPrice';
import './AdminExtra.css';

const EMPTY_FORM = { name: '', description: '', fee: '', estimatedDays: '', isActive: true };

const AdminShippingPage = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchMethods = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getShippingMethods();
      setMethods(res.shippingMethods || []);
    } catch (err) {
      toast.error(err.message || 'Không thể tải phương thức vận chuyển');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (method) => {
    setEditing(method);
    setForm({
      name: method.name,
      description: method.description || '',
      fee: Number(method.fee),
      estimatedDays: method.estimatedDays || '',
      isActive: method.isActive
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.fee) < 0) {
      toast.warning('Phí vận chuyển không được âm');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, fee: Number(form.fee) };
      if (editing) {
        await adminAPI.updateShippingMethod(editing.id, payload);
        toast.success('Đã cập nhật phương thức vận chuyển');
      } else {
        await adminAPI.createShippingMethod(payload);
        toast.success('Đã thêm phương thức vận chuyển');
      }
      setShowModal(false);
      fetchMethods();
    } catch (err) {
      toast.error(err.message || 'Không thể lưu phương thức vận chuyển');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (method) => {
    try {
      await adminAPI.updateShippingMethod(method.id, { isActive: !method.isActive });
      fetchMethods();
    } catch (err) {
      toast.error(err.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (method) => {
    if (!window.confirm(`Xóa phương thức "${method.name}"?`)) return;
    try {
      await adminAPI.deleteShippingMethod(method.id);
      toast.success('Đã xóa phương thức vận chuyển');
      fetchMethods();
    } catch (err) {
      toast.error(err.message || 'Không thể xóa phương thức vận chuyển');
    }
  };

  return (
    <div className="admin-extra-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Phương thức vận chuyển</h1>
          <p className="page-desc">
            Phương thức có phí thấp nhất được miễn phí cho đơn từ {formatPrice(500000)}
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <FiPlus /> Thêm phương thức
        </button>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên phương thức</th>
              <th>Mô tả</th>
              <th>Thời gian dự kiến</th>
              <th>Phí</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="empty-text">Đang tải...</td>
              </tr>
            ) : methods.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-text">Chưa có phương thức vận chuyển nào</td>
              </tr>
            ) : (
              methods.map((method) => (
                <tr key={method.id}>
                  <td><strong>{method.name}</strong></td>
                  <td>{method.description || '—'}</td>
                  <td>{method.estimatedDays || '—'}</td>
                  <td>{formatPrice(method.fee)}</td>
                  <td>
                    <button
                      type="button"
                      className={`extra-badge ${method.isActive ? 'is-on' : 'is-off'}`}
                      onClick={() => handleToggle(method)}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Bấm để đổi trạng thái"
                    >
                      {method.isActive ? 'Đang áp dụng' : 'Tạm ẩn'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon btn-edit" onClick={() => openEdit(method)} title="Sửa">
                        <FiEdit2 />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(method)} title="Xóa">
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Sửa phương thức vận chuyển' : 'Thêm phương thức vận chuyển'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Tên phương thức *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="VD: Giao hàng nhanh" />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <input name="description" value={form.description} onChange={handleChange} placeholder="VD: Giao trong 1-2 ngày làm việc" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phí vận chuyển (VNĐ) *</label>
                  <input name="fee" type="number" min={0} step={1000} value={form.fee} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Thời gian dự kiến</label>
                  <input name="estimatedDays" value={form.estimatedDays} onChange={handleChange} placeholder="VD: 1-2 ngày" />
                </div>
              </div>
              <div className="form-group form-checkbox">
                <label>
                  <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
                  <span>Cho phép khách hàng chọn phương thức này</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShippingPage;
