require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const DATABASE_DIR = path.join(__dirname, '../../../database');

function findDumpFile() {
  if (process.env.DB_DUMP_FILE) {
    return path.isAbsolute(process.env.DB_DUMP_FILE)
      ? process.env.DB_DUMP_FILE
      : path.join(DATABASE_DIR, process.env.DB_DUMP_FILE);
  }

  if (!fs.existsSync(DATABASE_DIR)) {
    throw new Error(`Không tìm thấy thư mục database: ${DATABASE_DIR}`);
  }

  const sqlFiles = fs.readdirSync(DATABASE_DIR).filter((file) => file.toLowerCase().endsWith('.sql'));

  if (sqlFiles.length === 0) {
    throw new Error(`Không tìm thấy file .sql nào trong ${DATABASE_DIR}`);
  }

  sqlFiles.sort((a, b) => {
    const timeA = fs.statSync(path.join(DATABASE_DIR, a)).mtimeMs;
    const timeB = fs.statSync(path.join(DATABASE_DIR, b)).mtimeMs;
    return timeB - timeA;
  });

  return path.join(DATABASE_DIR, sqlFiles[0]);
}

async function importDb() {
  const dumpFile = findDumpFile();
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

  if (!DB_NAME) {
    throw new Error('Thiếu biến môi trường DB_NAME trong file .env');
  }

  console.log(`Đang đọc file dump: ${dumpFile}`);

  const adminConnection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS
  });

  await adminConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await adminConnection.end();

  console.log(`Đã đảm bảo database "${DB_NAME}" tồn tại`);

  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    multipleStatements: true
  });

  const sql = fs.readFileSync(dumpFile, 'utf8');

  console.log(`Đang import dữ liệu vào database "${DB_NAME}"...`);
  await connection.query(sql);
  await connection.end();

  console.log(`Import thành công từ file "${path.basename(dumpFile)}" vào database "${DB_NAME}"`);
}

importDb().catch((error) => {
  console.error('Import database thất bại:', error.message);
  process.exit(1);
});
