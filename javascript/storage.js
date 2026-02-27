const StorageSingleton = (() => {
    const KEY = 'TODO_APP_DATA';

    return {
        save(tasks) {
            localStorage.setItem(KEY, JSON.stringify(tasks));
        },
        fetch() {
            const data = localStorage.getItem(KEY);
            return data ? JSON.parse(data) : [];
        }
    };
})();

export default StorageSingleton;
