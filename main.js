const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const appServe = serve.default ? serve.default({ directory: 'out' }) : serve({ directory: 'out' });

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Geliştirme ortamı ile Prodüksiyon ortamını ayırıyoruz
    if (app.isPackaged) {
        appServe(win).then(() => {
            win.loadURL('app://-');
        });
    } else {
        // Geliştirme modundaysan (npm run dev ile çalışıyorsa)
        win.loadURL('http://localhost:3000');
        // win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
