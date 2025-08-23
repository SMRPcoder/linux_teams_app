# Electron Teams for Linux (Unofficial)

⚡ An **unofficial Electron wrapper** for Microsoft Teams on Linux.  
Run Microsoft Teams in a native desktop-like experience with support for notifications, system tray, auto-updates, and multiple Linux package formats.

> 🐧 Microsoft discontinued the official Linux Teams client.  
This project brings it back by wrapping the Teams web version in an **Electron app**.

---

## 🚀 Features

- ✅ Native-like desktop experience
- ✅ Linux builds: **AppImage**, **.deb**, **.rpm**
- ✅ System notifications
- ✅ System tray icon support
- ✅ Compatible with **Ubuntu, Fedora, Arch, Debian, and more**

---

## 📦 Download

Download the latest release from the [Releases Page](https://github.com/SMRPcoder/linux_teams_app/releases).

Available packages:
- 🖥️ `AppImage` (portable, works on any Linux distro)
- 📦 `.deb` (Debian/Ubuntu-based distributions)
- 📦 `.rpm` (Fedora/RedHat-based distributions)

### Installation Examples

**Ubuntu/Debian**:
```bash
wget https://github.com/SMRPcoder/linux_teams_app/releases/latest/download/my-teams-app_1.1.6_amd64.deb
sudo apt install ./my-teams-app_1.1.6_amd64.deb
```

**Fedora/RHEL**:
```bash
wget https://github.com/SMRPcoder/linux_teams_app/releases/latest/download/my-teams-app-1.1.6.x86_64.rpm
sudo dnf install ./my-teams-app-1.1.6.x86_64.rpm
```

**AppImage** (Portable):
```bash
chmod +x My.Teams-1.1.6.AppImage
./My.Teams-1.1.6.AppImage
```

---

## 🛠️ Development Setup

To run or build the project locally:

```bash
git clone https://github.com/SMRPcoder/linux_teams_app.git
cd linux_teams_app
npm install
npm run start
```

To build packages:
```bash
npm run dist
```

---

## 🌍 Why?

Microsoft discontinued support for the official Teams client on Linux, leaving many developers, open-source contributors, and businesses without a native solution. This project offers a seamless way to use Microsoft Teams on Linux without relying on a browser or switching platforms.

---

## ⚠️ Disclaimer

This project is not affiliated with Microsoft. It is an open-source Electron wrapper for the Microsoft Teams web app, created for convenience on Linux systems.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

---

## 🔍 SEO Keywords

Microsoft Teams Linux, Teams for Ubuntu, Teams Fedora RPM, Teams AppImage, Electron Teams Linux, Microsoft Teams Linux alternative, unofficial Teams desktop client