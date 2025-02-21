import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Brak MONGODB_URI w .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log("🔄 Używam istniejącego połączenia z MongoDB.");
    return cached.conn.connection.db; // 🔥 Zwracamy właściwą bazę danych!
  }

  if (!cached.promise) {
    console.log("🔗 Próba połączenia z MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("✅ Połączono z MongoDB!");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ Błąd połączenia z MongoDB:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn.connection.db; // 🔥 Tutaj zwracamy `db` zamiast `mongoose`
}

export default connectToDatabase;
