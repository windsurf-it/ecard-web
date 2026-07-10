# เว็บไซต์การ์ด

#Demo : http://localhost:3000
#Demo : http://localhost:3000/api/encrypt?name=ชื่อผู้รับ

---

เว็บไซต์การ์ดเชิญงานขึ้นบ้านใหม่แบบอินเทอร์แอคทีฟ สร้างด้วย Next.js รองรับการเปิดซองจดหมาย แกลเลอรี่รูป เพลงพื้นหลัง แผนที่ และ PromptPay

---

## คุณสมบัติหลัก

- **ซองจดหมาย** – เปิดซองเพื่อดูการ์ดเชิญ พร้อมเอฟเฟกต์ใบไม้และพื้นหลัง
- **การ์ดเชิญ** – หน้าแรก-หลัง การ์ด (ใช้รูปใน `public/images/`)
- **วันที่งาน & นับถอยหลัง** – แสดงวันขึ้นบ้านและ countdown
- **แกลเลอรี่** – แถบฟิล์มเลื่อนอัตโนมัติ คลิกดูอัลบั้มแบบ lightbox
- **เครื่องเล่นแผ่นเสียง** – เล่นเพลงเมื่อเปิดซอง (โหมดมินิเมื่อเลื่อนลง)
- **ปุ่มแผนที่** – ลิงก์ไป Google Maps
- **ปุ่ม PromptPay** – โมดัลแสดง QR และชื่อบัญชี

---

## โครงสร้างโปรเจกต์

```
├── app/
│   ├── layout.tsx      # เมตาดาต้า, font, Analytics
│   ├── page.tsx       # หน้าแรก แสดง CardInvitation
│   └── globals.css    # สไตล์และ keyframes
├── components/
│   ├── card-invitation.tsx  # หน้าหลัก รวมทุก section
│   ├── envelope-section.tsx    # ซองจดหมาย + ลำดับ animation
│   ├── invitation-card.tsx     # การ์ดหน้า-หลัง
│   ├── couple-section.tsx      # วันที่ + countdown
│   ├── gallery-section.tsx     # แกลเลอรี่ฟิล์ม
│   ├── vinyl-player.tsx        # เครื่องเล่นเพลง
│   └── ui/
│       └── button.tsx
├── lib/
│   └── utils.ts
├── public/
│   ├── images/         # รูปการ์ด (card-front.png, card-back.png)
│   ├── music/          # ไฟล์เพลง (card-music.mp3)
│   ├── slide-images/   # รูปแกลเลอรี่ แยกโฟลเดอร์ 1, 2, 3, ...
│   ├── icon-pp.png     # ไอคอน PromptPay
│   └── qrcode.jpg      # รูป QR PromptPay (ใส่เอง)
├── Dockerfile
├── .dockerignore
└── package.json
```

---

## การติดตั้งและรัน (พัฒนาบนเครื่อง)

### ต้องการ

- Node.js 18+
- pnpm / yarn / npm

### ติดตั้ง

```bash
pnpm install
# หรือ yarn install / npm install
```

### รันโหมดพัฒนา

```bash
pnpm dev
# หรือ yarn dev / npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### บิลด์และรันโหมด production

```bash
pnpm build
pnpm start
```

---

## วิธีใส่ข้อมูลของคุณ

### 1. ชื่อและเมตาดาต้า (SEO / แชร์)

แก้ใน **`app/layout.tsx`**:

- `metadata.title` – ชื่อแท็บและหัวข้อแชร์
- `metadata.description` – คำอธิบาย
- `openGraph` / `twitter` – ใช้ค่าข้างบนหรือปรับให้ตรงกับงาน

### 2. แผนที่และ PromptPay

แก้ใน **`components/card-invitation.tsx`** (ด้านบนไฟล์):

- **`MAP_LINK`** – ลิงก์ Google Maps สถานที่จัดงาน (ใส่ `"#"` ถ้ายังไม่มี)
- **`PROMPTPAY_ACCOUNT_NAME`** – ชื่อบัญชีที่แสดงในโมดัล PromptPay

ใส่รูป QR PromptPay ที่ **`public/qrcode.jpg`** (ถ้าไม่มีจะแสดง placeholder)

### 3. รูปการ์ดเชิญ

- **`public/images/card-front.png`** – หน้าการ์ด
- **`public/images/card-back.png`** – หลังการ์ด

### 4. เพลง

ใส่ไฟล์ใน **`public/music/`** แล้วอ้างใน **`components/vinyl-player.tsx`**:

- เช่น `card-music.mp3` (และ/หรือ `.ogg` ตามที่ใช้ใน `<source>`)

### 5. แกลเลอรี่

- ใส่รูปใน **`public/slide-images/<เลขโฟลเดอร์>/`**
- แต่ละโฟลเดอร์มีอย่างน้อย **`main.svg`** หรือ **`main.jpg`** เป็นรูปหลัก
- แก้ **`folderIds`** และ **`folderImagesMap`** ใน **`components/gallery-section.tsx`** ให้ตรงกับโฟลเดอร์และรายชื่อไฟล์จริง

---

## รันด้วย Docker

### บิลด์ image

```bash
docker build -t card-invitation .
```

### รัน container

```bash
docker run -p 3000:3000 card-invitation
```

เปิด [http://localhost:3000](http://localhost:3000)

### ตัวอย่างรันแบบกำหนดชื่อและพอร์ต

```bash
docker run --name wedding-card -p 8080:3000 -d card-invitation
```

เว็บจะอยู่ที่พอร์ต 8080

---

## สคริปต์ที่มีในโปรเจกต์

| คำสั่ง       | ความหมาย           |
| ------------ | ------------------ |
| `pnpm dev`   | รันโหมดพัฒนา       |
| `pnpm build` | บิลด์ production   |
| `pnpm start` | รันหลัง build แล้ว |
| `pnpm lint`  | ตรวจ lint          |

---

## เทคโนโลยีที่ใช้

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Vercel Analytics** (ถ้า deploy บน Vercel)

---

## หมายเหตุ

- โปรเจกต์นี้เตรียมไว้เป็น template สำหรับการ์ดงานขึ้นบ้านใหม่ สามารถเปลี่ยนข้อความ รูป เพลง และลิงก์ตามงานจริงได้ตามหัวข้อ “วิธีใส่ข้อมูลของคุณ” ด้านบน
