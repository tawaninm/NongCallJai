import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var __voicemedMongoose: MongooseCache | undefined;
}

const cached = globalThis.__voicemedMongoose ?? { conn: null, promise: null };
globalThis.__voicemedMongoose = cached;

export function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (mongoUri) return mongoUri;

  const legacyDatabaseUrl = process.env.DATABASE_URL?.trim();
  if (
    legacyDatabaseUrl?.startsWith("mongodb://") ||
    legacyDatabaseUrl?.startsWith("mongodb+srv://")
  ) {
    return legacyDatabaseUrl;
  }

  return undefined;
}

export function getMongoStatus() {
  return {
    configured: Boolean(getMongoUri()),
    readyState: mongoose.connection.readyState,
    connected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host || undefined,
  };
}

export async function connectDb() {
  if (cached.conn) return cached.conn;

  const uri = getMongoUri();
  if (!uri) {
    throw new Error("MONGODB_URI is not configured. Set it to your MongoDB Atlas connection URI.");
  }

  cached.promise ??= mongoose.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
  });
  cached.conn = await cached.promise;
  return cached.conn;
}
