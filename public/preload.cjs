const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  remove: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  // se envia y espera respuesta
  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  },
  saveImage: (imageData, imageName) => {
    return ipcRenderer.invoke('save-image', { imageData, imageName });
  },
});