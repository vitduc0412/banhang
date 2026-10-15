import { useCallback, useEffect, useState } from 'react';
import { FiEye, FiX, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api';
import './AdminExtra.css';

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getContacts({ page, limit: 10 });
      setContacts(res.contacts || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || 'Không thể tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const openContact = async (contact) => {
    setSelected(contact);
    if (contact.isRead) return;
    try {
      await adminAPI.markContactRead(contact.id);
      setContacts((prev) => prev.map((item) => (item.id === contact.id ? { ...item, isRead: true } : item)));
    } catch (err) {
      toast.error(err.message || 'Không thể cập nhật trạng thái liên hệ');
    }
  };

  const unreadCount = contacts.filter((item) => !item.isRead).length;

  return (
    <div className="admin-extra-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Liên hệ từ khách hàng</h1>
          <p className="page-desc">
            {unreadCount > 0 ? `${unreadCount} liên hệ chưa đọc trên trang này` : 'Đã đọc hết liên hệ trên trang này'}
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người gửi</th>
              <th>Chủ đề</th>
              <th>Nội dung</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="empty-text">Đang tải...</td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-text">Chưa có liên hệ nào</td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id} className={`contact-row ${contact.isRead ? '' : 'is-unread'}`}>
                  <td>
                    <div className="pair-cell">
                      <span>{contact.name}</span>
                      <small>{contact.email}</small>
                    </div>
                  </td>
                  <td>{contact.subject || '—'}</td>
                  <td><div className="contact-message">{contact.message}</div></td>
                  <td>{new Date(contact.createdAt).toLocaleString('vi-VN')}</td>
                  <td>
                    <span className={`extra-badge ${contact.isRead ? 'is-off' : 'is-new'}`}>
                      {contact.isRead ? 'Đã đọc' : 'Mới'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon btn-edit" onClick={() => openContact(contact)} title="Xem chi tiết">
                      <FiEye />
                    </button>
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

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selected.subject || 'Liên hệ từ khách hàng'}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-form contact-detail">
              <dl>
                <dt>Họ tên</dt>
                <dd>{selected.name}</dd>
                <dt>Email</dt>
                <dd>{selected.email}</dd>
                <dt>Điện thoại</dt>
                <dd>{selected.phone || '—'}</dd>
                <dt>Ngày gửi</dt>
                <dd>{new Date(selected.createdAt).toLocaleString('vi-VN')}</dd>
                <dt>Nội dung</dt>
                <dd>{selected.message}</dd>
              </dl>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setSelected(null)}>Đóng</button>
                <a
                  className="btn-primary"
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Phản hồi: ${selected.subject || 'Liên hệ VelvetStore'}`)}`}
                >
                  <FiMail /> Trả lời qua email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactsPage;
