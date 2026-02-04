# 🌊 Amazon Wave | Premium Rewards Infrastructure

A high-performance rewards platform built with **React**, **Vite**, and **Cloudflare Pages**. This project features a native "Brain" (Cloudflare KV) that allows real-time management of destination links via a secure Admin Console.

---

## 🛠️ Step 1: Database Provisioning (Cloudflare KV)

Before deploying the frontend, you must prepare the storage layer:

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Storage & Databases** > **KV**.
3. Click **Create Namespace** and name it `APP_DB`.
4. **Copy the Namespace ID** (e.g., `8f2d...`). You will need this for the configuration file.

---

## ⚙️ Step 2: Local Configuration

You need to link your code to the database you just created:

1. Open `wrangler.jsonc` (or `wrangler.toml`) in your project root.
2. Locate the `kv_namespaces` block.
3. Replace the placeholder ID with your **Namespace ID**:

```
configure wrangler.jsonc

{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "amadevnew",
  "pages_build_output_dir": "dist", 
  "compatibility_date": "2026-02-03",
  "kv_namespaces": [
    {
      "binding": "APP_DB",
      "id": "PASTE_YOUR_ID_HERE" 
    }
  ]
}
```

---

## 🚀 Step 3: Deployment Settings

When connecting your repository to **Cloudflare Pages**, use these exact build parameters:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `React (Vite)` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Node.js Version** | `18+` | (disent required)

---

## 🧠 Step 4: The "Handshake" (Function Binding)

**CRITICAL:** Cloudflare requires a manual binding step to allow the "Brain" to talk to the Website.

1. In your Cloudflare Pages Project, go to **Settings** > **Functions**.
2. Scroll down to **KV namespace bindings**.
3. Click **Add binding** for both **Production** and **Preview**:
   - **Variable name:** `APP_DB`
   - **KV namespace:** Select your `APP_DB` from the dropdown.
4. **Final Step:** Go to the **Deployments** tab and **Retry Deployment** to activate the new bindings.

---

## 🔐 Admin Console Access

The site features a hidden administrative layer to manage your links:

- **Path:** Click "Admin Console" in the footer (only visible on hover/focus).
- **Default ID:** `test`
- **Security Key:** `root`

> [!TIP]
> **Why this architecture is superior:** 
> Unlike traditional sites, the "Primary Redirect" is handled server-side via `/functions/api/config.ts`. This ensures that when you update a link in the Admin Dashboard, the change is instant and global for every visitor.

---

## 📁 Project Structure

```bash
├── functions/api/config.ts  # The "Brain" (Cloudflare KV API)
├── src/App.tsx              # UI Logic & Design
├── wrangler.jsonc           # Database Binding Config
└── README.md                # This Guide
```

---

<div align="center">
  <p><b>© 2026 Amazing Wave Infrastructure • Secure. Instant. Premium.</b></p>
</div>