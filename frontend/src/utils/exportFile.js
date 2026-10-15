const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const exportCsv = (filename, columns, rows) => {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(',');
  const lines = rows.map((row) =>
    columns
      .map((column) => escapeCsvValue(typeof column.value === 'function' ? column.value(row) : row[column.value]))
      .join(',')
  );
  const blob = new Blob(['﻿' + [header, ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')}₫`;

const paymentStatusLabel = (status) => {
  if (status === 'paid') return 'Đã thanh toán';
  if (status === 'failed') return 'Thất bại';
  return 'Chưa thanh toán';
};

export const printInvoice = (order, shop = {}) => {
  const rows = (order.items || [])
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.productName || item.product?.name)}</td>
          <td>${escapeHtml(item.size)} / ${escapeHtml(item.color)}</td>
          <td class="num">${item.quantity}</td>
          <td class="num">${money(item.price)}</td>
          <td class="num">${money(Number(item.price) * item.quantity)}</td>
        </tr>`
    )
    .join('');

  const shopName = escapeHtml(shop.shop_name || 'VelvetStore');

  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>Hóa đơn ${escapeHtml(order.orderCode)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 32px; font-size: 13px; }
  .head { display: flex; justify-content: space-between; border-bottom: 2px solid #1a1a2e; padding-bottom: 16px; margin-bottom: 20px; }
  .head h1 { margin: 0 0 4px; font-size: 22px; color: #1a1a2e; letter-spacing: 1px; }
  .head p { margin: 2px 0; color: #4b5563; }
  .title { text-align: right; }
  .title h2 { margin: 0 0 6px; font-size: 18px; text-transform: uppercase; }
  .info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .info h3 { font-size: 13px; margin: 0 0 6px; text-transform: uppercase; color: #6b7280; }
  .info p { margin: 3px 0; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: left; }
  th { background: #f3f4f6; }
  .num { text-align: right; white-space: nowrap; }
  .summary { margin-left: auto; margin-top: 16px; width: 320px; }
  .summary div { display: flex; justify-content: space-between; padding: 4px 0; }
  .summary .total { border-top: 1px solid #1a1a2e; margin-top: 6px; padding-top: 8px; font-size: 15px; font-weight: bold; }
  .foot { margin-top: 40px; text-align: center; color: #6b7280; }
  @media print { body { margin: 12mm; } }
</style>
</head>
<body>
  <div class="head">
    <div>
      <h1>${shopName}</h1>
      <p>${escapeHtml(shop.shop_address)}</p>
      <p>${escapeHtml(shop.shop_phone)} · ${escapeHtml(shop.shop_email)}</p>
    </div>
    <div class="title">
      <h2>Hóa đơn bán hàng</h2>
      <p>Mã đơn: <strong>${escapeHtml(order.orderCode)}</strong></p>
      <p>Ngày đặt: ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
    </div>
  </div>
  <div class="info">
    <div>
      <h3>Khách hàng</h3>
      <p><strong>${escapeHtml(order.fullName || order.user?.fullName)}</strong></p>
      <p>${escapeHtml(order.phone || order.user?.phone)}</p>
      <p>${escapeHtml(order.address)}</p>
    </div>
    <div>
      <h3>Thanh toán</h3>
      <p>Phương thức: ${order.paymentMethod === 'vnpay' ? 'VNPay' : 'Thanh toán khi nhận hàng (COD)'}</p>
      <p>Trạng thái: ${paymentStatusLabel(order.paymentStatus)}</p>
      ${order.note ? `<p>Ghi chú: ${escapeHtml(order.note)}</p>` : ''}
    </div>
  </div>
  <table>
    <thead>
      <tr><th>#</th><th>Sản phẩm</th><th>Phân loại</th><th class="num">SL</th><th class="num">Đơn giá</th><th class="num">Thành tiền</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="summary">
    <div><span>Tạm tính</span><span>${money(order.subtotal)}</span></div>
    <div><span>Phí vận chuyển</span><span>${money(order.shippingFee)}</span></div>
    <div><span>Giảm giá</span><span>-${money(order.discount)}</span></div>
    <div class="total"><span>Tổng cộng</span><span>${money(order.total)}</span></div>
  </div>
  <p class="foot">Cảm ơn quý khách đã mua sắm tại ${shopName}!</p>
  <script>window.onload = function () { window.print(); };</script>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return false;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return true;
};

export const paymentStatusText = paymentStatusLabel;
