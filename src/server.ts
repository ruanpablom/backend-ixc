import 'dotenv/config';
import { server } from './config/app';

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`))

