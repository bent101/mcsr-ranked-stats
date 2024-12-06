import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://photjrryzqlkjnxnypvm.supabase.co",
  "LE7vkFAFBsk5QBp9",
);

export async function checkStorageState() {
  const browserInfo = {
    userAgent: navigator.userAgent,
    browser: getBrowserInfo(),
    timestamp: new Date().toISOString(),
    localStorage: {
      available: isLocalStorageAvailable(),
      wasEmpty: true, // Will be updated
      writeSucceeded: false, // Will be updated
    },
    indexedDB: {
      available: Boolean(window.indexedDB),
      wasEmpty: true, // Will be updated
      writeSucceeded: false, // Will be updated
    },
  };

  // Check localStorage state
  if (browserInfo.localStorage.available) {
    browserInfo.localStorage.wasEmpty = localStorage.length === 0;
    try {
      localStorage.setItem("storage_test", "test");
      browserInfo.localStorage.writeSucceeded = true;
      localStorage.removeItem("storage_test");
    } catch (e) {
      browserInfo.localStorage.writeSucceeded = false;
      console.error("localStorage write failed:", e);
    }
  }

  // Check IndexedDB state
  if (browserInfo.indexedDB.available) {
    try {
      const isEmpty = await checkIndexedDBEmpty();
      browserInfo.indexedDB.wasEmpty = isEmpty;
      const writeSucceeded = await testIndexedDBWrite();
      browserInfo.indexedDB.writeSucceeded = writeSucceeded;
    } catch (e) {
      console.error("IndexedDB check failed:", e);
    }
  }

  // Upload to Supabase
  try {
    const { data, error } = await supabase
      .from("storage_checks")
      .insert([browserInfo]);

    if (error) {
      console.error("Failed to upload to Supabase:", error);
      return;
    }

    console.log("Successfully logged storage state:", data);
  } catch (e) {
    console.error("Failed to interact with Supabase:", e);
  }
}

// Helper function to get browser name and version
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "unknown";
  let version: string | undefined = "unknown";

  if (ua.includes("Chrome")) {
    browser = "Chrome";
    version = ua.match(/Chrome\/(\d+)/)?.[1];
  } else if (ua.includes("Firefox")) {
    browser = "Firefox";
    version = ua.match(/Firefox\/(\d+)/)?.[1];
  } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
    browser = "Safari";
    version = ua.match(/Version\/(\d+)/)?.[1];
  } else if (ua.includes("Edge")) {
    browser = "Edge";
    version = ua.match(/Edge\/(\d+)/)?.[1];
  }

  return { name: browser, version };
}

// Helper function to safely check localStorage availability
function isLocalStorageAvailable() {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Helper function to check if IndexedDB is empty
function checkIndexedDBEmpty(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("storage_test_db", 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const stores = Array.from(db.objectStoreNames);
      db.close();

      // Consider it empty if there are no object stores
      resolve(stores.length === 0);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // If this is called, the database was just created (was empty)
      resolve(true);
      db.close();
    };
  });
}

// Helper function to test IndexedDB write capability
function testIndexedDBWrite(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("storage_test_db", 1);

    request.onerror = () => reject(request.error);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("test_store")) {
        db.createObjectStore("test_store", { keyPath: "id" });
      }
    };

    request.onsuccess = async () => {
      const db = request.result;
      try {
        const transaction = db.transaction(["test_store"], "readwrite");
        const store = transaction.objectStore("test_store");

        const addRequest = store.add({ id: 1, test: "test" });

        addRequest.onsuccess = () => {
          // Clean up
          const deleteRequest = store.delete(1);
          deleteRequest.onsuccess = () => {
            db.close();
            // Optionally delete the test database
            indexedDB.deleteDatabase("storage_test_db");
            resolve(true);
          };
          deleteRequest.onerror = () => {
            db.close();
            resolve(false);
          };
        };

        addRequest.onerror = () => {
          db.close();
          resolve(false);
        };
      } catch (e) {
        db.close();
        resolve(false);
      }
    };
  });
}

// Run the check
checkStorageState();
