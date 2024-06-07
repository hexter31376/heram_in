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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('forum');
    const posts = await db.collection('post').find({}).toArray();
    const formattedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
    }));
    return new Response(JSON.stringify(formattedPosts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
