import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined")
}
console.log("Connecting to:", process.env.MONGODB_URI)

//@ts-expect-error - Global is used here to maintain cached connection accross
// hot reloads.
let cached = global.mongoose

if (!cached) {
  //@ts-expect-error -  connection set to null if not cached
  cached = global.mongoose = {
    conn: null,
    promise: null,
  }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
    console.log("Connected to DB")
  } catch (e) {
    cached.promise = null
    throw e
  }
  return cached.conn
}

export default dbConnect
