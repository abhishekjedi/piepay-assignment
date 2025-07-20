import express from 'express';
import AppRouter from './router';

const app = express();

// Middleware
app.use(express.json());

// Router setup
try {
  const router = AppRouter(); 
  app.use(router);
} catch (err) {
  console.error('Failed to load router:', err);
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
