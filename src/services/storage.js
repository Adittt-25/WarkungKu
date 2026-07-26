import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys used across the app
export const KEYS = {
  SESSION: '@warungku_session',
  PRODUCTS: '@warungku_products',
  TRANSACTIONS: '@warungku_transactions',
  USERS: '@warungku_users',
};

// Generic helpers
export async function save(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.log('storage save error', e);
    return false;
  }
}

export async function load(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.log('storage load error', e);
    return fallback;
  }
}

export async function remove(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log('storage remove error', e);
    return false;
  }
}

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  } catch (e) {
    return false;
  }
}

// ---- Domain specific helpers ----

export async function getSession() {
  return load(KEYS.SESSION, null);
}

export async function setSession(user) {
  return save(KEYS.SESSION, user);
}

export async function logout() {
  return remove(KEYS.SESSION);
}

export async function getUsers() {
  return load(KEYS.USERS, []);
}

export async function registerUser(user) {
  const users = await getUsers();
  users.push(user);
  await save(KEYS.USERS, users);
  return true;
}

export async function getProducts() {
  const products = await load(KEYS.PRODUCTS, null);
  if (products === null) {
    // seed dummy data on first run
    const seed = [
      { id: '1', name: 'Indomie Goreng', price: 3500, stock: 40, photo: null },
      { id: '2', name: 'Aqua 600ml', price: 4000, stock: 25, photo: null },
      { id: '3', name: 'Teh Botol Sosro', price: 5000, stock: 18, photo: null },
      { id: '4', name: 'Roti Tawar Sari Roti', price: 15000, stock: 10, photo: null },
      { id: '5', name: 'Kopi Kapal Api Sachet', price: 1500, stock: 60, photo: null },
    ];
    await save(KEYS.PRODUCTS, seed);
    return seed;
  }
  return products;
}

export async function saveProducts(products) {
  return save(KEYS.PRODUCTS, products);
}

export async function getTransactions() {
  return load(KEYS.TRANSACTIONS, []);
}

export async function addTransaction(trx) {
  const list = await getTransactions();
  list.unshift(trx);
  await save(KEYS.TRANSACTIONS, list);
  return true;
}
