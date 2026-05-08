import { app } from './app.js';
import { env } from './config/env.js';
import { connectDb } from './db/connect-db.js';

const startServer = async () => {
  try {
    await connectDb();
    app.listen(env.PORT, () => {
      console.log(`Backend running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
};

void startServer();
