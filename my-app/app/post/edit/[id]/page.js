import EditPostClient from './EditPostClient';
import clientPromise from '../../../../utils/db';
import { ObjectId } from 'mongodb';

async function getPost(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db('forum');
  const post = await db.collection('post').findOne({ _id: new ObjectId(id) });

  if (!post) {
    return null;
  }

  return {
    ...post,
    _id: post._id.toString(),
  };
}

export default async function EditPostPage({ params }) {
  const { id } = params;
  const post = await getPost(id);

  if (!post) {
    return <p>Post not found</p>;
  }

  return <EditPostClient post={post} />;
}
