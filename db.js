export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("BoatDB", 1);
        request.onerror = function (event) {
            reject("Database failed to open");
        };
        request.onsuccess = function (event) {
            resolve(request.result);
        };
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const boatStore = db.createObjectStore("boats", { keyPath: "name" });
        };
    });
}
export function saveBoatToDB(boat) {
    return new Promise((resolve, reject) => {  
        openDB().then(db => {
            const transaction = db.transaction("boats", "readwrite");
            const boatStore = transaction.objectStore("boats");
            boatStore.put(boat);
            transaction.oncomplete = function () {
                resolve();  
            };
            transaction.onerror = function (event) {
                reject(`Error saving boat to database: "${event.target.error}`);  
            };
        }).catch((error) => {
            reject("Error opening database: " + error);  // Handle any error opening the database
        });
    });
}
export function getBoatsFromDB() {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction("boats", "readonly");
            const boatStore = transaction.objectStore("boats");
            const boats = [];
            const request = boatStore.openCursor();
            request.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    boats.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(boats);
                }
            };
            request.onerror = function () {
                reject("Error fetching boats.");
            };
        }).catch(error => {
            reject("Error opening the database: " + error);
        });
    });
};
export function getBoatFromDB(name) {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction("boats", "readonly");
            const boatStore = transaction.objectStore("boats");
            const request = boatStore.get(name);  
            request.onsuccess = function () {
                if (request.result) {
                    resolve(request.result); 
                } else {
                    resolve(null); 
                }
            };
            request.onerror = function () {
                reject("Error retrieving boat from database.");
            };
        }).catch((error) => {
            reject("Error opening database: " + error);
        });
    });
}
export function deleteBoat(name) {
    openDB().then(db => {
        const tx = db.transaction("boats", "readwrite");
        const store = tx.objectStore("boats");
        const request = store.delete(name);
        request.onsuccess = () => console.log(`Boat '${name}' deleted.`);
        request.onerror = () => console.error("Delete failed.");
    }).catch(err => {
        console.error("Error deleting boat:", err);
    })
}