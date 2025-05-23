import 'dotenv/config';
import { app } from './src/app.js';

/**
 * Starts the Express server.
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Listening on http://localhost:${PORT}`); });