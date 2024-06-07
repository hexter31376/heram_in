import clientPromise from '../../../utils/db';
import { ObjectId } from 'mongodb';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const PostWrapper = dynamic(() => import('./PostWrapper'), { ssr: false });

async function getPost(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  try {
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
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export default async function EditPostPage({ params }) {
  const { id } = params;
  const post = await getPost(id);

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostWrapper id={id} />
    </Suspense>
  );
}

// 이 함수는 모든 동적 경로를 사전에 생성하는 데 사용됩니다.
export async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db('forum');
  const posts = await db.collection('post').find({}, { projection: { _id: 1 } }).toArray();

  return posts.map(post => ({
    id: post._id.toString(),
  }));
}
