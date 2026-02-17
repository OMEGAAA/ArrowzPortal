/**
 * NewsManager
 * Handles storage and retrieval of news items using LocalStorage.
 * Falls back to window.NEWS_DATA (from news_data.js) if no local data exists.
 */
class NewsManager {
    static STORAGE_KEY = 'arrowz_news_data';

    /**
     * Retrieves all news items.
     * @returns {Array} Array of news objects.
     */
    /**
     * Retrieves all news items.
     * Ensures every item has an ID.
     * @returns {Array} Array of news objects.
     */
    static getNews() {
        let newsData = [];
        const stored = localStorage.getItem(this.STORAGE_KEY);

        if (stored) {
            try {
                newsData = JSON.parse(stored);
                // Ensure it's an array
                if (!Array.isArray(newsData)) {
                    console.warn("Stored news data is not an array. Resetting.");
                    newsData = this.getDefaultData();
                }
            } catch (e) {
                console.error("Error parsing stored news data", e);
                newsData = this.getDefaultData();
            }
        } else {
            // Initialize with default data if nothing is in storage
            newsData = this.getDefaultData();
        }

        // Auto-assign IDs if missing
        let modified = false;
        newsData.forEach((item, index) => {
            if (!item.id) {
                // Generate a simple ID based on timestamp and index
                item.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5) + index;
                modified = true;
            }
        });

        if (modified) {
            this.saveNews(newsData);
        }

        return newsData;
    }

    /**
     * Gets a specific news item by ID.
     * @param {string} id 
     * @returns {Object|null}
     */
    static getNewsById(id) {
        const news = this.getNews();
        return news.find(item => item.id === id) || null;
    }

    /**
     * Gets default data from window.NEWS_DATA or empty array.
     */
    static getDefaultData() {
        return window.NEWS_DATA || [];
    }

    /**
     * Saves the news array to LocalStorage.
     * @param {Array} newsData 
     */
    static saveNews(newsData) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newsData));
    }

    /**
     * Adds a new news item to the beginning of the list.
     * @param {Object} item News item object
     */
    static addNews(item) {
        const currentNews = this.getNews();
        // Ensure ID
        if (!item.id) {
            item.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }
        currentNews.unshift(item); // Add to the beginning
        this.saveNews(currentNews);
    }

    /**
     * Deletes a news item at a specific index.
     * @param {number} index Index of the item to delete
     */
    static deleteNews(index) {
        if (index >= 0 && index < currentNews.length) {
            currentNews.splice(index, 1);
            this.saveNews(currentNews);
        }
    }

    /**
     * Updates an existing news item by ID.
     * @param {string} id The ID of the item to update
     * @param {Object} updatedItem The new item data
     * @returns {boolean} True if successful, false if not found
     */
    static updateNews(id, updatedItem) {
        const currentNews = this.getNews();
        const index = currentNews.findIndex(item => item.id === id);

        if (index !== -1) {
            // Preserve the original ID if not provided in updatedItem
            updatedItem.id = id;
            currentNews[index] = updatedItem;
            this.saveNews(currentNews);
            return true;
        }
        return false;
    }

    /**
     * Resets data to the initial state (from news_data.js).
     */
    static reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        return this.getNews(); // Will reload defaults
    }

    /**
     * Generates the JS content for news_data.js
     * @returns {string} The formatted JS content
     */
    static getExportJS() {
        const news = this.getNews();
        return `window.NEWS_DATA = ${JSON.stringify(news, null, 4)};\n`;
    }
}

// Export for global usage if needed, or just attach to window
window.NewsManager = NewsManager;
