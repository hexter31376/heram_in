"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import styles from './PostClient.module.css';

// 동적 import를 사용하여 Viewer 컴포넌트를 클라이언트에서만 로드합니다.
const Viewer = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Viewer), { ssr: false });

function PostClient({ post }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const shouldReload = searchParams.get('reload') !== 'true';

  useEffect(() => {
    setIsClient(true);

    if (shouldReload) {
      // 페이지 로드 시 자동 새로고침, 한 번만 새로고침되도록 쿼리 파라미터 추가
      router.replace(`${window.location.pathname}?reload=true`);
      window.location.reload();
    }
  }, [shouldReload, router]);

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Post deleted successfully');
        router.push('/list?refresh=true'); // 삭제 후 목록 페이지로 리다이렉트하고 refresh 쿼리 파라미터 추가
      } else {
        alert('Failed to delete post');
      }
    }
  };

  const handleEdit = () => {
    router.push(`/post/edit/${post._id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.viewer}>
        {isClient && <Viewer initialValue={post.content} />}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleEdit} className={styles.button}>Edit</button>
        <button onClick={handleDelete} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
      </div>
    </div>
  );
}

export default function PostClientWrapper({ post }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostClient post={post} />
    </Suspense>
  );
}
