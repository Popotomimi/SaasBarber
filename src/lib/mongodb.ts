import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Defina a variável de ambiente MONGODB_URI");
}

// Tipagem explícita para o cache
type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

// Declaração global segura
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Inicializa o cache global
const globalCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

export async function connectToDatabase(): Promise<Mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  globalCache.conn = await globalCache.promise;
  globalThis.mongooseCache = globalCache;
  return globalCache.conn;
}
