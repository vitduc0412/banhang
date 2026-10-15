const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const API_URL = process.env.E2E_API_URL || 'http://localhost:5000/api';
const SHOT_DIR = path.join(__dirname, '..', '..', 'screenshots');
fs.mkdirSync(SHOT_DIR, { recursive: true });

const shot = (page, name) => page.screenshot({ path: path.join(SHOT_DIR, name), fullPage: true });

const loginAs = async (page, request, email, password) => {
  const res = await request.post(`${API_URL}/auth/login`, { data: { email, password } });
  const { token, user } = await res.json();
  await page.goto('/');
  await page.evaluate(([savedToken, savedUser]) => {
    localStorage.setItem('token', savedToken);
    localStorage.setItem('user', JSON.stringify(savedUser));
  }, [token, user]);
  return token;
};

const waitForImages = async (page) => {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
};

test.describe('Gợi ý sản phẩm - khách vãng lai', () => {
  test('trang chủ hiển thị khối gợi ý cho khách mới', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Gợi ý dành cho bạn' })).toBeVisible();
    await expect(page.locator('.rec-section .product-card').first()).toBeVisible();
    await expect(page.locator('.rec-section .product-card-reason').first()).toBeVisible();
    await waitForImages(page);
    await shot(page, '01-trang-chu-goi-y-khach-moi.png');
  });

  test('chi tiết sản phẩm có mua kèm, tương tự và ghi nhận lượt xem', async ({ page }) => {
    await page.goto('/san-pham/ao-so-mi-oxford-dai-tay');
    await expect(page.getByRole('heading', { name: 'Thường được mua cùng' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sản phẩm tương tự' })).toBeVisible();
    await expect(page.locator('.product-card-reason', { hasText: 'Thường được mua cùng' }).first()).toBeVisible();
    await waitForImages(page);
    await shot(page, '02-chi-tiet-san-pham-goi-y.png');

    await page.goto('/san-pham/quan-kaki-baggy');
    await expect(page.getByRole('heading', { name: 'Bạn đã xem gần đây' })).toBeVisible();

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Sản phẩm bạn đã xem' })).toBeVisible();
    await expect(page.getByText('Được chọn lọc từ lịch sử xem')).toBeVisible();
    await waitForImages(page);
    await shot(page, '03-trang-chu-ca-nhan-hoa-sau-khi-xem.png');
  });

  test('lọc theo danh mục cha hiển thị sản phẩm của danh mục con', async ({ page }) => {
    await page.goto('/danh-muc/1');
    await expect(page.locator('.product-card').first()).toBeVisible();
    await waitForImages(page);
    await shot(page, '04-danh-muc-cha-ao.png');
  });

  test('giao diện điện thoại không tràn ngang', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Gợi ý dành cho bạn' })).toBeVisible();
    await waitForImages(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBeFalsy();
    await shot(page, '05-trang-chu-mobile.png');
  });
});

test.describe('Gợi ý sản phẩm - khách hàng đã đăng nhập', () => {
  test('trang chủ, giỏ hàng và thanh toán', async ({ page, request }) => {
    const token = await loginAs(page, request, 'minhanh.le@gmail.com', '123456');
    const headers = { Authorization: `Bearer ${token}` };
    await request.delete(`${API_URL}/cart`, { headers });
    await request.post(`${API_URL}/cart`, { headers, data: { variantId: 10, quantity: 1 } });
    const addressRes = await request.get(`${API_URL}/addresses`, { headers });
    if (!((await addressRes.json()).addresses || []).length) {
      await request.post(`${API_URL}/addresses`, {
        headers,
        data: {
          fullName: 'Lê Minh Anh',
          phone: '0912345678',
          province: 'Thành phố Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Phạm Ngũ Lão',
          street: '45 Trần Hưng Đạo',
          isDefault: true
        }
      });
    }

    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Dành riêng cho/ })).toBeVisible();
    await waitForImages(page);
    await shot(page, '06-trang-chu-khach-dang-nhap.png');

    await page.goto('/gio-hang');
    await expect(page.getByRole('heading', { name: 'Thường được mua cùng' })).toBeVisible();
    await expect(page.locator('.cart-recommendations .product-card').first()).toBeVisible();
    await waitForImages(page);
    await shot(page, '07-gio-hang-goi-y-mua-kem.png');

    await page.goto('/thanh-toan');
    const addressCard = page.locator('.address-card, .address-item').first();
    if (await addressCard.isVisible().catch(() => false)) {
      await addressCard.click();
    }
    await page.getByRole('button', { name: /Tiếp tục/ }).first().click();
    await expect(page.getByText('Phương thức vận chuyển')).toBeVisible();
    await page.getByText('Giao hàng nhanh').click();
    await expect(page.locator('.summary-line', { hasText: 'Phí vận chuyển' })).toContainText('50.000');
    await shot(page, '08-thanh-toan-chon-van-chuyen.png');

    await request.delete(`${API_URL}/cart`, { headers });
  });
});

test.describe('Quản trị', () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAs(page, request, 'admin@velvetstore.vn', 'admin123');
  });

  test('trang thống kê gợi ý', async ({ page }) => {
    await page.goto('/admin/goi-y');
    await expect(page.getByRole('heading', { name: 'Gợi ý sản phẩm thông minh' })).toBeVisible();
    await expect(page.getByText('Cặp sản phẩm hay được mua cùng')).toBeVisible();
    await expect(page.locator('.extra-card .admin-table tbody tr').first()).toBeVisible();
    await shot(page, '09-admin-goi-y.png');
  });

  test('trang vận chuyển', async ({ page }) => {
    await page.goto('/admin/van-chuyen');
    await expect(page.getByRole('heading', { name: 'Phương thức vận chuyển' })).toBeVisible();
    await expect(page.getByText('Giao hàng tiêu chuẩn')).toBeVisible();
    await shot(page, '10-admin-van-chuyen.png');
  });

  test('trang liên hệ', async ({ page }) => {
    await page.goto('/admin/lien-he');
    await expect(page.getByRole('heading', { name: 'Liên hệ từ khách hàng' })).toBeVisible();
    await shot(page, '11-admin-lien-he.png');
  });

  test('trang cấu hình', async ({ page }) => {
    await page.goto('/admin/cau-hinh');
    await expect(page.getByRole('heading', { name: 'Cấu hình hệ thống' })).toBeVisible();
    await expect(page.locator('#shop_name')).toHaveValue(/.+/);
    await shot(page, '12-admin-cau-hinh.png');
  });

  test('đơn hàng có xuất Excel và in hóa đơn', async ({ page }) => {
    await page.goto('/admin/don-hang');
    const exportButton = page.getByRole('button', { name: /Xuất Excel/ });
    await expect(exportButton).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^don-hang-.*\.csv$/);
    await page.locator('.btn-expand').first().click();
    await expect(page.getByRole('button', { name: /In hóa đơn/ })).toBeVisible();
    await shot(page, '13-admin-don-hang-xuat-in.png');
  });

  test('sản phẩm có xuất Excel', async ({ page }) => {
    await page.goto('/admin/san-pham');
    const exportButton = page.getByRole('button', { name: /Xuất Excel/ });
    await expect(exportButton).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^san-pham-.*\.csv$/);
    await shot(page, '14-admin-san-pham-xuat.png');
  });
});
