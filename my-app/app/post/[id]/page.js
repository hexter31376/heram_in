import clientPromise from '../../../utils/db';
import { ObjectId } from 'mongodb';
import PostClientWrapper from './PostClient';
import Link from 'next/link';
import styles from './PostClient.module.css';
import React, { Suspense } from 'react';

async function getPost(id) {
  if (!ObjectId.isValid(id)) {
    return null; // ID가 유효하지 않으면 null 반환
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

function PostWrapper({ id }) {
  const [post, setPost] = React.useState(null);
  
  React.useEffect(() => {
    async function fetchData() {
      const post = await getPost(id);
      setPost(post);
    }
    fetchData();
  }, [id]);

  if (!post) {
    return (
      <div className={styles.container}>
        <p className={styles.notFound}>Post not found</p>
        <Link href="/list">
          <button className={styles.button}>Go to List</button>
        </Link>
      </div>
    );
  }

  return <PostClientWrapper post={post} />;
}

export default function Page({ params }) {
  const { id } = params;

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
