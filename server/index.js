import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8787;

// CORS（仅本机/同网段使用，可按需收紧）
app.use(cors());

// 解析JSON
app.use(express.json({ limit: '10mb' }));

// 静态托管前端
const publicDir = path.resolve(__dirname, '..');
app.use('/', express.static(publicDir));

// 存储目录：server/local2
const storageRoot = path.resolve(__dirname, 'local2');
const uploadsDir = path.join(storageRoot, 'uploads');
const thumbsDir = path.join(storageRoot, 'thumbs');
const dbFile = path.join(storageRoot, 'records.json');

for (const p of [storageRoot, uploadsDir, thumbsDir]) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ records: [] }, null, 2));

// Multer配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const id = nanoid(10);
    const ext = path.extname(file.originalname) || '';
    cb(null, `${Date.now()}_${id}${ext}`);
  }
});
const upload = multer({ storage });

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// 获取记录列表
app.get('/api/records', (_req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'read_failed' });
  }
});

// 新增文字记录
app.post('/api/records/text', (req, res) => {
  try {
    const { title = '', text = '', date = new Date().toISOString().slice(0,10) } = req.body || {};
    const id = `rec_${nanoid(8)}`;
    const record = {
      id,
      type: 'text',
      title,
      text,
      date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    data.records.push(record);
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    res.json({ ok: true, record });
  } catch (e) {
    res.status(500).json({ error: 'write_failed' });
  }
});

// 上传图片/视频记录
app.post('/api/records/media', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no_file' });
    const { title = '', text = '', type = 'image', date = new Date().toISOString().slice(0,10) } = req.body || {};
    const id = `rec_${nanoid(8)}`;
    const record = {
      id,
      type,
      title,
      text,
      date,
      mediaPath: path.relative(storageRoot, req.file.path),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    data.records.push(record);
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    res.json({ ok: true, record });
  } catch (e) {
    res.status(500).json({ error: 'write_failed' });
  }
});

// 删除记录
app.delete('/api/records/:id', (req, res) => {
  try {
    const id = req.params.id;
    const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    const idx = data.records.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'not_found' });
    const [removed] = data.records.splice(idx, 1);
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    // 清理文件
    if (removed.mediaPath) {
      const abs = path.join(storageRoot, removed.mediaPath);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'delete_failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Love server running at http://localhost:${PORT}`);
});


