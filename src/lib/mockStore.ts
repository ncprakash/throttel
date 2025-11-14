import crypto from 'crypto';

export type UserRole = 'user' | 'admin';

export type UserRecord = {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  role: UserRole;
};

export type ProductRecord = {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
};

type SessionRecord = {
  userId: string;
  role: UserRole;
};

const users: UserRecord[] = [
  {
    id: 'admin-1',
    email: 'admin@throtter.io',
    name: 'Throttle Admin',
    passwordHash: hashPassword('ThrottleAdmin!23'),
    role: 'admin',
  },
];

const products: ProductRecord[] = [
  {
    id: 'prod-001',
    name: 'Forged Carbon Wheel',
    description: 'Ultra-lightweight forged carbon wheel for race applications.',
    price: 1299,
    createdAt: new Date().toISOString(),
  },
];

const sessions = new Map<string, SessionRecord>();
const adminSessions = new Map<string, SessionRecord>();

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, passwordHash: string) {
  return hashPassword(password) === passwordHash;
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email: string, password: string, name?: string) {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const user: UserRecord = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash: hashPassword(password),
    role: 'user',
  };

  users.push(user);
  return user;
}

export function authenticateUser(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export function createSession(user: UserRecord) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId: user.id, role: user.role });
  return token;
}

export function getUserFromSession(token?: string | null) {
  if (!token) return null;
  const record = sessions.get(token);
  if (!record) return null;
  const user = users.find((u) => u.id === record.userId);
  return user ?? null;
}

export function createAdminSession(user: UserRecord) {
  const token = crypto.randomBytes(32).toString('hex');
  adminSessions.set(token, { userId: user.id, role: user.role });
  return token;
}

export function getAdminFromSession(token?: string | null) {
  if (!token) return null;
  const record = adminSessions.get(token);
  if (!record) return null;
  const user = users.find((u) => u.id === record.userId && u.role === 'admin');
  return user ?? null;
}

export function listProducts() {
  return products;
}

export function addProduct(name: string, description: string, price: number) {
  const product: ProductRecord = {
    id: crypto.randomUUID(),
    name,
    description,
    price,
    createdAt: new Date().toISOString(),
  };

  products.unshift(product);
  return product;
}

export function removeProduct(productId: string) {
  const index = products.findIndex((product) => product.id === productId);
  if (index === -1) {
    return false;
  }
  products.splice(index, 1);
  return true;
}


