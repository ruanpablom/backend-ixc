import app from './config/app';
import 'dotenv/config';
import { MongoHelper } from './infra/db/mongodb/helpers/mongo-helper';

const PORT = process.env.PORT || 3003;

MongoHelper.connect(process.env.MONGO_URL as string)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(PORT, () => console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`))
  })
  .catch(console.error)

