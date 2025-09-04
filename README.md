# Frontend - FE Win Project

Frontend project ini dibuat menggunakan **Next.js** dan beberapa library pendukung seperti **React Hook Form**, **TanStack Query**, dan **ShadCN UI**. Project ini berfungsi untuk berinteraksi dengan backend project yang sudah disediakan, termasuk fitur register, login, dan manajemen product.

---

## 🔧 Setup dan Menjalankan Project

1. Clone repository ini.
2. Install dependencies:

```bash
npm install
```

3. Jalankan Project

```bash
npm run dev
```

4. buka browser di http://localhost:3000

## 📝 Fitur

1. User Authentication

- Register: Untuk mendaftarkan user baru.
- Login: Masuk ke sistem menggunakan akun yang sudah terdaftar.

2. Dashboard

- Menampilkan profile user yang sedang login:
  - Nama
  - Email
  - Gender
- Tabs Product
  - All Products: Menampilkan semua produk dari semua user.
  - User's Product: Menampilkan hanya produk yang dimiliki oleh user yang sedang login.
  - Dilengkapi dengan pagination untuk berpindah halaman produk.

3. Create Product

- Tersedia tombol Create Product di tab Product.
- Menampilkan Dialog Form untuk input:
  - Name
  - Price
  - Quantity
  - Data yang di-submit akan menambahkan produk baru untuk user.

5. Update & Delete Product

- Di tab User's Product, setiap produk dapat di-update atau di-delete.
- Update menampilkan form dialog dengan data awal produk (default values).
- Delete menampilkan confirmation dialog sebelum menghapus produk.
- Semua perubahan otomatis melakukan refresh data menggunakan TanStack Query (invalidateQueries).

## 📂 Struktur Project (Inti)

```bash
/app
  /register
    /page.tsx      --> register
  /login
    /page.tsx      --> login
  /page.tsx        --> Dashboard utama, tabs, table
/components
  /UI              --> from shadcn

/hooks
  useProducts.ts
  useUsers.ts

/store
  store.ts
```
