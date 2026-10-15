import { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api';
import './AdminExtra.css';

const SECTIONS = [
  {
    title: 'Thông tin cửa hàng',
    fields: [
      { key: 'shop_name', label: 'Tên cửa hàng' },
      { key: 'shop_phone', label: 'Số điện thoại' },
      { key: 'shop_email', label: 'Email liên hệ', type: 'email' },
      { key: 'shop_address', label: 'Địa chỉ' },
      { key: 'shop_description', label: 'Mô tả ngắn', multiline: true, full: true }
    ]
  },
  {
    title: 'Mạng xã hội',
    fields: [
      { key: 'facebook_url', label: 'Facebook', type: 'url' },
      { key: 'instagram_url', label: 'Instagram', type: 'url' },
      { key: 'tiktok_url', label: 'TikTok', type: 'url' }
    ]
  },
  {
    title: 'Chính sách',
    fields: [
      { key: 'return_policy', label: 'Chính sách đổi trả', multiline: true, full: true },
      { key: 'shipping_policy', label: 'Chính sách vận chuyển', multiline: true, full: true },
      { key: 'warranty_policy', label: 'Chính sách bảo hành', multiline: true, full: true }
    ]
  }
];

const AdminSettingsPage = () => {
  const [values, setValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    adminAPI.getSystemConfig()
      .then((res) => {
        const map = {};
        (res.configs || []).forEach((item) => {
          map[item.key] = item.value || '';
        });
        setValues(map);
        setInitialValues(map);
      })
      .catch((err) => toast.error(err.message || 'Không thể tải cấu hình'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key) => (e) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.warning('Vui lòng chọn file ảnh');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await adminAPI.uploadImage(formData);
      setValues((prev) => ({ ...prev, shop_logo: res.url }));
      toast.success('Đã tải logo lên, bấm Lưu để áp dụng');
    } catch (err) {
      toast.error(err.message || 'Không thể tải logo lên');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changedKeys = Object.keys(values).filter((key) => values[key] !== initialValues[key]);
    if (!changedKeys.length) {
      toast.info('Không có thay đổi nào');
      return;
    }
    setSaving(true);
    try {
      for (const key of changedKeys) {
        await adminAPI.updateSystemConfig({ key, value: values[key] });
      }
      setInitialValues(values);
      toast.success('Đã lưu cấu hình hệ thống');
    } catch (err) {
      toast.error(err.message || 'Không thể lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="page-title">Cấu hình hệ thống</h1>
          <p className="page-desc">Thông tin hiển thị ở chân trang, trang liên hệ và trang chính sách</p>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-section">
          <h2>Logo</h2>
          <div className="settings-logo">
            <div className="settings-logo__preview">
              {values.shop_logo ? <img src={values.shop_logo} alt="Logo cửa hàng" /> : 'Chưa có logo'}
            </div>
            <label className="btn-secondary" style={{ cursor: 'pointer' }}>
              <FiUpload /> {uploading ? 'Đang tải lên...' : 'Tải logo mới'}
              <input type="file" accept="image/*" hidden onChange={handleLogoUpload} disabled={uploading} />
            </label>
            {values.shop_logo && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setValues((prev) => ({ ...prev, shop_logo: '' }))}
              >
                Gỡ logo
              </button>
            )}
          </div>
        </div>

        {SECTIONS.map((section) => (
          <div className="settings-section" key={section.title}>
            <h2>{section.title}</h2>
            <div className="form-row">
              {section.fields.map((field) => (
                <div className="form-group" key={field.key} style={field.full ? { gridColumn: '1 / -1' } : undefined}>
                  <label htmlFor={field.key}>{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      id={field.key}
                      rows={3}
                      value={values[field.key] || ''}
                      onChange={handleChange(field.key)}
                    />
                  ) : (
                    <input
                      id={field.key}
                      type={field.type || 'text'}
                      value={values[field.key] || ''}
                      onChange={handleChange(field.key)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="settings-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
