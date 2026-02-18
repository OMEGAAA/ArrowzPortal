// Scheme:
// { id: string, date: string (YYYY.MM.DD), title: string, category: string, description: string, type: 'closed' | 'event' }

const ScheduleManager = {
    getAll: function () {
        return window.SCHEDULE_DATA || [];
    },

    add: function (item) {
        if (!window.SCHEDULE_DATA) window.SCHEDULE_DATA = [];
        item.id = Date.now().toString();
        window.SCHEDULE_DATA.push(item);
        this.saveToLocalStorage();
        return item;
    },

    update: function (id, updatedItem) {
        if (!window.SCHEDULE_DATA) return false;
        const index = window.SCHEDULE_DATA.findIndex(i => i.id === id);
        if (index === -1) return false;

        updatedItem.id = id; // Preserve ID
        window.SCHEDULE_DATA[index] = updatedItem;
        this.saveToLocalStorage();
        return true;
    },

    delete: function (index) {
        if (!window.SCHEDULE_DATA) return;
        window.SCHEDULE_DATA.splice(index, 1);
        this.saveToLocalStorage();
    },

    saveToLocalStorage: function () {
        localStorage.setItem('SCHEDULE_DATA_CACHE', JSON.stringify(window.SCHEDULE_DATA));
    },

    loadFromLocalStorage: function () {
        const cached = localStorage.getItem('SCHEDULE_DATA_CACHE');
        if (cached) {
            window.SCHEDULE_DATA = JSON.parse(cached);
        }
    },

    getExportJS: function () {
        const data = window.SCHEDULE_DATA || [];
        return `window.SCHEDULE_DATA = ${JSON.stringify(data, null, 4)};`;
    }
};

// Initialize
// ScheduleManager.loadFromLocalStorage(); // Optional: Load from local storage if valid, but usually we prefer the loaded JS file as source of truth.
// For admin, maybe load from local storage to keep unsaved changes?
// The NewsManager pattern seems to rely on the loaded JS file + manual download.
