
export const DB_NAME = 'StudentDB';
export const DB_VERSION = 45;  // Incremented version number
export const STORE_NAME = 'students';
export const VISITS_STORE_NAME = 'visits';
export const READINGS_STORE_NAME = 'readings';
export const ADMISSION_REQUESTS_STORE_NAME = 'admissionRequests';
export const NOTIFICATIONS_STORE_NAME = 'notifications';

export async function openDB() {
  return new Promise(async (resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;


      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      if (db.objectStoreNames.contains(VISITS_STORE_NAME)) {
        db.deleteObjectStore(VISITS_STORE_NAME);
      }

      if (db.objectStoreNames.contains(READINGS_STORE_NAME)) {
        db.deleteObjectStore(READINGS_STORE_NAME);
      }

      if (db.objectStoreNames.contains(ADMISSION_REQUESTS_STORE_NAME)) {
        db.deleteObjectStore(ADMISSION_REQUESTS_STORE_NAME);
      }

      if (db.objectStoreNames.contains(NOTIFICATIONS_STORE_NAME)) {
        db.deleteObjectStore(NOTIFICATIONS_STORE_NAME);
      }



      const studentsStore = db.createObjectStore(STORE_NAME, { keyPath: 'idNumber', autoIncrement: true });
      studentsStore.createIndex('roleTypeIDX', 'roleType', { unique: false });

      const visitsStore = db.createObjectStore(VISITS_STORE_NAME, { keyPath: 'visitDate', autoIncrement: false });
      visitsStore.createIndex('idNumber', 'idNumber', { unique: false });

      const readingsStore = db.createObjectStore(READINGS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      readingsStore.createIndex('idNumIDX', 'idNumber', { unique: false });

      const admissionRequestsStore = db.createObjectStore(ADMISSION_REQUESTS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      admissionRequestsStore.createIndex('nameIDX', 'requesterName', { unique: false });

      const notificationRequestsStore = db.createObjectStore(NOTIFICATIONS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      notificationRequestsStore.createIndex('requesterID', 'idNumber', { unique: false });
      console.log(`Upgrade needed. New version: ${DB_VERSION}`);

      request.transaction.oncomplete = () => {
        resolve(db);
      };
    };

    request.onsuccess = async (event) => {
      const db = event.target.result;
      console.log(`Database opened successfully. Version: ${db.version}`);
      resolve(db);
    };

    request.onerror = (event) => {
      console.error(`Error opening database: ${event.target.error}`);
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
        resolve(event.target.result || []);
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

export async function saveReadingToDB(db, reading) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(READINGS_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(READINGS_STORE_NAME);

    const request = objectStore.add(reading);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function getAllReadings(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(READINGS_STORE_NAME, 'readonly');
    const objectStore = transaction.objectStore(READINGS_STORE_NAME);

    const request = objectStore.getAll()

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function addAdmissionRequestToDB(db, admissionRequest) {
  const transaction = db.transaction(ADMISSION_REQUESTS_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(ADMISSION_REQUESTS_STORE_NAME);
  await store.add(admissionRequest);
}

export async function getAllAdmissionRequests(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(ADMISSION_REQUESTS_STORE_NAME, 'readonly');
  const store = transaction.objectStore(ADMISSION_REQUESTS_STORE_NAME);
  const request = store.getAll();
  request.onsuccess = (event) => {
    resolve(event.target.result);
  };

  request.onerror = (event) => {
    reject(event.target.error);
  };
  })
  
}

export async function saveNotificationToDB(db, notification) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(NOTIFICATIONS_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(NOTIFICATIONS_STORE_NAME);

    const request = objectStore.add(notification);


    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });

}

export async function getAllNotifications(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(NOTIFICATIONS_STORE_NAME, 'readonly');
  const store = transaction.objectStore(NOTIFICATIONS_STORE_NAME);
  const request = store.getAll();
  request.onsuccess = (event) => {
    resolve(event.target.result);
  };

  request.onerror = (event) => {
    reject(event.target.error);
  };
  })
  
}








