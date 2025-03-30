# GhostDrop

GhostDrop is a **lightweight P2P file-sharing platform** designed for quick and secure file transfers between devices. It allows users to upload files, generate a **download link and QR code**, and delete the file after downloading.

## 🚀 Features

- **Instant File Uploads**: Upload any file type and receive a unique link.
- **QR Code Sharing**: Scan the QR code to download the file on any device.
- **No Account Needed**: No login or authentication required for sharing.
- **Manual File Deletion**: Delete the file once the transfer is complete.
- **Secure & Fast**: Built with Supabase for secure file storage and sharing.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Supabase (Storage)
- **QR Code Generator**: `react-qr-code`

## 🏗️ Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/GhostDrop.git
cd GhostDrop
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com/).
2. Enable Storage and create a bucket called `file-share`.
3. Retrieve your Supabase API Keys from the dashboard.
4. Create a `.env` file in the root directory and add:

```sh
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4️⃣ Run Locally

```sh
npm run dev
```

## 📝 Usage

1. Upload a file using the file picker.
2. Copy the generated link or scan the QR code to download the file.
3. Click **"Delete File"** to remove the file from storage.

## ❌ File Deletion Issues?

If you can't delete files, ensure you have the correct Supabase Storage Policies:

1. Go to **Supabase Dashboard → Storage → Buckets → file-share → Policies**.
2. Add a new policy:

```sql
create policy "Allow deletion for all users"
on storage.objects
for delete
using (true);
```

3. Save and try deleting files again.

## 📜 License

This project is licensed under the **MIT License**.

---

Enjoy **GhostDrop**! 🚀

Built by **Your Name**

## 🔜 Next Steps

- Add **file expiration** (auto-delete after X minutes).
- Improve **UI/UX** with better styling.
- Host the app on **Vercel** for free public access.

