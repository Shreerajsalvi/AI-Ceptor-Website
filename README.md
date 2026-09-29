# AI-CEPTOR — AEROMAC DYNAMICS

> **Autonomous Aerial Interception Platform**  
> Precision-engineered aerospace intelligence and defense web platform built with Next.js 16, React 19, Three.js, GSAP, and Framer Motion.

---

## 📋 System & Software Requirements

Before setting up and running the AI-CEPTOR web platform, ensure your system meets the following software prerequisites:

### 1. Required Runtimes & Package Managers

| Dependency | Minimum Version Required | Recommended Version |
| :--- | :--- | :--- |
| **Node.js** | `v18.17.0` | `v20.x LTS` or `v22.x LTS` |
| **npm** | `v9.0.0` | `v10.x` or latest |
| **Git** | `v2.30.0` | Latest release |

*Note: You can check your installed versions in your terminal:*
```bash
node -v
npm -v
git --version
```

### 2. Browser Requirements
* **WebGL 2.0 Support**: Google Chrome (v90+), Microsoft Edge (v90+), Mozilla Firefox (v88+), or Apple Safari (v15+).
* **Hardware Acceleration**: Enabled in browser settings for 60fps 3D canvas rendering and smooth GSAP scrollytelling.

---

## 🚀 Quick Start Guide

### Step 1: Clone the Repository
Open your terminal (PowerShell, Command Prompt, or Terminal) and run:

```bash
git clone https://github.com/AeromacCodes/AI-Ceptor-website.git
cd AI-Ceptor-website
```

### Step 2: Install Project Dependencies
Install all required Node.js packages:

```bash
npm install
```

---

## 💻 Detailed Terminal Commands

| Task | Terminal Command | Description |
| :--- | :--- | :--- |
| **Development Server** | `npm run dev` | Starts local Next.js development server with Turbopack on `http://localhost:3000`. |
| **Network Dev Server** | `npx next dev -H 0.0.0.0` | Exposes local dev server to all devices on your local network (Wi-Fi/LAN). |
| **Production Build** | `npm run build` | Compiles optimized static assets and server bundles. |
| **Run Production Server** | `npm run start` | Launches production server after building (`npm run build`). |
| **Lint Codebase** | `npm run lint` | Runs ESLint to verify code quality and TypeScript standards. |

---

## 🛠️ Running the Application (Step-by-Step)

### 1. Launching Development Mode

Run the following command in the project root folder:

```bash
npm run dev
```

**Expected Terminal Output:**
```text
> aeromac-aiceptor@0.1.0 dev
> next dev -H 0.0.0.0

▲ Next.js 16.2.10 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 1.2s
```

Open your browser and navigate to: **`http://localhost:3000`**

---

### 2. Building for Production Deployment

To test or generate a production-ready build:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

---

## ⚙️ Environment Configuration (`.env.local`)

Create a `.env.local` file in the root directory if you are configuring email or database services:

```env
# Contact Form Email API (Resend)
RESEND_API_KEY=re_your_api_key_here

# AWS RDS MySQL Database Configuration
DB_HOST=your-aws-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=aiceptor_website
```

---

## 🏗️ Technology Stack Architecture

* **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack) & [React 19](https://react.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **3D & Canvas Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
* **Animations**: [GSAP](https://gsap.com/) (ScrollTrigger), [Framer Motion](https://www.framer.com/motion/)
* **Smooth Scrolling**: [@studio-freight/lenis](https://lenis.darkroom.engineering/)
* **Styling**: Vanilla CSS Design System & [Tailwind CSS v4](https://tailwindcss.com/)
* **Interactive Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)

---

## ⚙️ Troubleshooting

* **Node Version Mismatch**: If you see unsupported Node warnings, use `nvm` (Node Version Manager) to switch to Node 20:
  ```bash
  nvm install 20
  nvm use 20
  ```
* **Port 3000 Busy**: Next.js will automatically fall back to port `3001` or `3002` if `3000` is already in use by another application.

---

© **AEROMAC DYNAMICS**. All Rights Reserved.
