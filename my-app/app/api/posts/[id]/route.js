import clientPromise from '../../../../utils/db';
import { ObjectId } from 'mongodb';

const DELETE_ENABLED = process.env.DELETE_ENABLED === 'true';
const UPDATE_ENABLED = process.env.UPDATE_ENABLED === 'true';

export async function DELETE(req, { params }) {
  if (!DELETE_ENABLED) {
    return new Response(JSON.stringify({ message: 'Delete operation is currently disabled' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: 'Invalid ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('forum');

    const result = await db.collection('post').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return new Response(JSON.stringify({ message: 'Post deleted successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(req) {
  if (!UPDATE_ENABLED) {
    return new Response(JSON.stringify({ message: 'Update operation is currently disabled' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { id, title, content } = await req.json();

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: 'Invalid post ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (!title || !content) {
    return new Response(JSON.stringify({ message: 'Title and content are required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('forum');

    const result = await db.collection('post').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
