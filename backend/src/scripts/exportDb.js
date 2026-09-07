require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATABASE_DIR = path.join(__dirname, '../../../database');

function pad(value) {
  return String(value).padStart(2, '0');
}

function buildDumpFileName() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  return `Dump${stamp}.sql`;
}

function exportDb() {
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

  if (!DB_NAME) {
    throw new Error('Thiếu biến môi trường DB_NAME trong file .env');
  }

  if (!fs.existsSync(DATABASE_DIR)) {
    fs.mkdirSync(DATABASE_DIR, { recursive: true });
  }

  const outputFile = path.join(DATABASE_DIR, buildDumpFileName());
  const passwordFlag = DB_PASS ? `-p${DB_PASS}` : '';
  const command = `mysqldump -h ${DB_HOST} -u ${DB_USER} ${passwordFlag} --databases ${DB_NAME}`;

  console.log(`Đang export database "${DB_NAME}" ra file: ${outputFile}`);
  const output = execSync(command, { maxBuffer: 1024 * 1024 * 200 });
  fs.writeFileSync(outputFile, output);

  console.log(`Export thành công: ${outputFile}`);
}

try {
  exportDb();
} catch (error) {
  console.error('Export database thất bại:', error.message);
  console.error('Kiểm tra xem lệnh "mysqldump" đã có trong PATH chưa (thường nằm trong thư mục bin của MySQL Server, ví dụ: C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin).');
  process.exit(1);
}
