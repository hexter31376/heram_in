"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostClient() {
  const editorRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // 웹에서 Toast UI Editor 로드
    const script = document.createElement('script');
    script.src = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';
    script.onload = () => {
      const { Editor } = window.toastui;
      editorRef.current = new Editor({
        el: document.querySelector('#editor'),
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        height: '400px',
        initialValue: '글을 작성하세요...',
      });
    };
    document.body.appendChild(script);

    // 스타일 시트 로드
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css';
    document.head.appendChild(link);

    return () => {
      // Clean up the dynamically added script and link
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editorInstance = editorRef.current;
    const content = editorInstance.getMarkdown();
    const title = e.target.title.value;

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert('새로운 글을 게시했습니다!');
      router.push('/list?refresh=true'); // 블로그 목록 페이지로 리다이렉트하면서 쿼리 파라미터 추가
      window.location.reload(); // 페이지를 새로고침하여 변경 사항 반영
    } else {
      alert('글 게시를 실패했습니다...');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="제목"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            fontSize: '1.2em',
            borderRadius: '5px',
            border: '1px solid #ddd',
          }}
          required
        />
        <div id="editor" style={{ marginBottom: '20px' }}></div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          작성하기
        </button>
      </form>
    </div>
  );
}
