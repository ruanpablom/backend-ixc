import 'dotenv/config';
import app from './config/app';

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`))

