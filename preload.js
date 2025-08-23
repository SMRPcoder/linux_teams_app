const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFile: (callback) => {
        const event = new Event('select-file');
        event.callback = callback;
        window.dispatchEvent(event);
    },
    notify: (data) => {
        const event = new Event('notify');
        event.data = data;
        window.dispatchEvent(event);
        // const { title, body } = data;
        // new Notification({ title, body, timeoutType: 'never' }).show();
    }
});