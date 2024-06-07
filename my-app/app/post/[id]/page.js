import clientPromise from '../../../utils/db';
import { ObjectId } from 'mongodb';
import PostClient from './PostClient';
import Link from 'next/link';
import styles from './PostClient.module.css';

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

export default async function Page({ params }) {
  const { id } = params;
  const post = await getPost(id);

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

  return <PostClient post={post} />;
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
