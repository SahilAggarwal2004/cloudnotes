import { Workbox } from "workbox-window";

export default function registersw() {
    if ('serviceWorker' in navigator) {
        const wb = new Workbox('/sw.js')
        wb.addEventListener('installed', event => { if (event.isUpdate) window.location.reload() })
        wb.register()
    }
}
