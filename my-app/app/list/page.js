import Link from 'next/link';
import clientPromise from '../../utils/db';

async function getPosts() {
  const client = await clientPromise;
  const db = client.db('forum');
  const posts = await db.collection('post').find({}).toArray();
  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
  }));
}

export default async function ListPage() {
  const posts = await getPosts();
  return (
    <div className="list-bg">
      {posts.map((post) => (
        <div className="list-item" key={post._id}>
          <h4>
            <Link href={`/post/${post._id}`}>
              {post.title}
            </Link>
          </h4>
          <p>{post.date}</p>
        </div>
      ))}
    </div>
  );
}
