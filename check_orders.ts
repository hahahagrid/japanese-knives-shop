import { getPayload } from 'payload'
import config from './src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env') })

async function checkOrders() {
  const payload = await getPayload({ config })
  const orders = await payload.find({
    collection: 'orders',
    sort: '-createdAt',
    limit: 1,
  })
  
  if (orders.docs.length > 0) {
    console.log('LATEST_ORDER:', JSON.stringify(orders.docs[0], null, 2))
  } else {
    console.log('NO_ORDERS_FOUND')
  }
  process.exit(0)
}

checkOrders()
