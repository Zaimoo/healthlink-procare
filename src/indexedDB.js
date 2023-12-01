export const DB_NAME = 'StudentDB';
export const DB_VERSION = 10;
export const STORE_NAME = 'students';
export const VISITS_STORE_NAME = 'visits';

export async function openDB() {
  return new Promise(async (resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'idNumber', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains(VISITS_STORE_NAME)) {
        const visitsStore = db.createObjectStore(VISITS_STORE_NAME, { keyPath: 'visitDate', autoIncrement: false });
        visitsStore.createIndex('idNumber', 'idNumber', { unique: false });
      }
    };

      request.onsuccess = async (event) => {
          const db = event.target.result;
          resolve(db);
      };

      request.onerror = (event) => {
          reject(event.target.error);
      };
  });
}


export async function getAllStudents(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function getAllVisits(db) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(VISITS_STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(VISITS_STORE_NAME);
      const request = objectStore.getAll();
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

export async function saveStudentToDB(db, student) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const { idNumber, ...studentWithoutId } = student;

    const request = objectStore.add(studentWithoutId);


    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });

}

export async function deleteVisitByDate(db, visitDate) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(VISITS_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(VISITS_STORE_NAME);

    const request = objectStore.delete(visitDate);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}




