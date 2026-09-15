# Mushibat Healthcare – Bihar (Mithila Region) Landing Page

A premium, modern healthcare appointment booking platform tailored specifically for Bihar (covering **Darbhanga, Samastipur, Madhubani, and Sitamarhi**).

Built using **Vite, Vanilla HTML/JS, Tailwind CSS (v4), and Lucide Icons**.

---

## 🚀 How to Run the Project Locally

### Prerequisites
Make sure you have **Node.js** installed on your computer. (To check, open your terminal/command prompt and type `node -v`).

### Step-by-Step Launch Guide

#### Option A: Quick Double-Click (Recommended)
1. Double-click the **`run_mushibat.bat`** file inside this folder.
2. It will automatically:
   - Start the local development server.
   - Open the web application in your default browser at **`http://localhost:5173/`**.

---

#### Option B: Manual Terminal Execution (VS Code / CMD)
If you are using **VS Code** (Visual Studio Code):

1. **Open Folder in VS Code**:
   - Open VS Code.
   - Go to `File` -> `Open Folder` (or `Ctrl + K, Ctrl + O`).
   - Select the `mushibat-healthcare` folder.

2. **Open the Integrated Terminal**:
   - Go to `Terminal` (top menu) -> `New Terminal` (or press ``Ctrl + ` ``).

3. **Install Dependencies** (If you are running it on a new system or cloned version):
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   - Ctrl+Click the link **`http://localhost:5173/`** shown in the terminal.

---

## 🛠️ Project Structure

- **`index.html`** - Main structure, containing Hero section, District selectors, Popular Hospitals grid, Doctor directory, Specialty search, FAQ, and Modals (Appointment booking, OTP login, Live Chat).
- **`index.css`** - Global CSS styles including custom glassmorphic properties, theme variables (Teal, Blue, Emerald), scrollbars, and keyframe animations.
- **`app.js`** - Dynamic client-side logic:
  - Interactive search and filter for hospitals and doctors.
  - Interactive Tabbed Login Modal (Mobile & Email OTP verification simulation).
  - Toast Notification Engine.
  - Maithili & Hindi context-aware Live Chat Assistant.
  - Persistent Light/Dark theme toggling.
- **`vite.config.js`** - Vite configuration with Tailwind CSS v4 support.

---

## 🔒 Simulated Features
- **OTP Verification**: Enter any 4-digit code (e.g. `1234`) to successfully verify and log in.
- **Appointment Booking**: Simulates OPD slot reservation, auto-schedules dates, and prints a success toast with simulated WhatsApp receipt delivery.
