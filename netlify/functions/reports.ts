import { Handler } from '@netlify/functions';
import { db } from '../../src/db';
import { reports } from '../../src/db/schema';
import { eq, desc } from 'drizzle-orm';

export const handler: Handler = async (event) => {
  const method = event.httpMethod;

  try {
    if (method === 'GET') {
      const allReports = await db.select().from(reports).orderBy(desc(reports.createdAt));
      return { statusCode: 200, body: JSON.stringify(allReports) };
    }

    if (method === 'POST') {
      const { title, location, priority, photoUrl, createdBy } = JSON.parse(event.body || '{}');
      if (!title || !location || !priority || !createdBy) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
      }
      const newReport = await db.insert(reports).values({
        title, location, priority, photoUrl, createdBy
      }).returning();
      return { statusCode: 201, body: JSON.stringify(newReport[0]) };
    }

    if (method === 'PUT') {
      // Update status or assign teknisi
      const { id, status, assignedTo } = JSON.parse(event.body || '{}');
      if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'ID is required' }) };

      const updateData: any = { updatedAt: new Date() };
      if (status) updateData.status = status;
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

      const updatedReport = await db.update(reports).set(updateData).where(eq(reports.id, id)).returning();
      return { statusCode: 200, body: JSON.stringify(updatedReport[0]) };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error) {
    console.error('Reports API error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
