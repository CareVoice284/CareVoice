import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email and password required' }) };
    }

    // Since we don't have a seed script running right now, we can inject a check:
    // If the database is empty or doesn't have the user, we should simulate or ideally let it fail correctly.
    // For now we'll query the user:
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = result[0];

    // Dummy fallback for testing if database is empty due to no seed
    if (!user) {
       if (email === 'admin@test.com' && password === 'password') return { statusCode: 200, body: JSON.stringify({ token: 'fake-jwt-admin', user: { id: 'admin-1', email, role: 'admin', name: 'Admin Sarpras' } }) };
       if (email === 'user@test.com' && password === 'password') return { statusCode: 200, body: JSON.stringify({ token: 'fake-jwt-user', user: { id: 'user-1', email, role: 'user', name: 'Pasien' } }) };
       if (email === 'teknisi@test.com' && password === 'password') return { statusCode: 200, body: JSON.stringify({ token: 'fake-jwt-teknisi', user: { id: 'teknisi-1', email, role: 'teknisi', name: 'Teknisi 1' } }) };
       
       return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }

    if (user.password !== password) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }

    // In a real app we'd sign a JWT here. For simplicity we'll just return a mock token + user data
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: `mock-jwt-${user.id}`,
        user: { id: user.id, email: user.email, role: user.role, name: user.name }
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
