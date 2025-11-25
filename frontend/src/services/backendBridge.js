// Removed uuid import, using crypto.randomUUID()


class BackendBridge {
    constructor() {
        this.worker = new Worker(new URL('../workers/pyodideWorker.js', import.meta.url));
        this.pendingRequests = new Map();

        this.worker.onmessage = (event) => {
            const { id, result, error } = event.data;
            if (this.pendingRequests.has(id)) {
                const { resolve, reject } = this.pendingRequests.get(id);
                this.pendingRequests.delete(id);

                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(result);
                }
            }
        };
    }

    async _send(type, payload = {}) {
        const id = crypto.randomUUID();
        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });
            this.worker.postMessage({ id, type, payload });
        });
    }

    async getState() {
        return this._send('GET_STATE');
    }

    async addExperience(value, sigma) {
        return this._send('ADD_EXPERIENCE', { value, sigma });
    }

    async meditate(meditationLevel) {
        return this._send('MEDITATE', { meditation_level: meditationLevel });
    }

    async setBrahmaViharas(level) {
        return this._send('SET_BRAHMA_VIHARAS', { level });
    }

    async reset() {
        return this._send('RESET');
    }
}

export const backend = new BackendBridge();
