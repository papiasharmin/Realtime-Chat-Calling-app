
import { MongoClient } from "mongodb"

const uri =  'mongodb+srv://"username:password"@cluster0.v7ewk3z.mongodb.net/?retryWrites=true&w=majority'//process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>


  client = new MongoClient(uri, options)
  clientPromise = client.connect()

export default clientPromise


