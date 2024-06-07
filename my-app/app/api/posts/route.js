import clientPromise from '../../../utils/db';

const CREATE_ENABLED = process.env.CREATE_ENABLED === 'true';

export async function POST(req) {
  if (!CREATE_ENABLED) {
    return new Response(JSON.stringify({ message: 'Create operation is currently disabled' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return new Response(JSON.stringify({ message: 'Title and content are required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const client = await clientPromise;
  const db = client.db('forum');

  const result = await db.collection('post').insertOne({
    title,
    content,
    createdAt: new Date(),
  });

  return new Response(JSON.stringify(result), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
