import { app } from './app.js';
import { env } from './config/env.js';
import { connectDb } from './db/connect-db.js';

const startServer = async () => {
  try {
    await connectDb();
    const onListen = () => {
      console.log(`Backend listening on port ${env.PORT}`);
    };
    if (env.NODE_ENV === "production") {
      app.listen(env.PORT, "0.0.0.0", onListen);
    } else {
      app.listen(env.PORT, onListen);
    }
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
};

void startServer();
