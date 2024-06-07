"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPostClient({ post }) {
  const editorRef = useRef(null);
  const router = useRouter();
  const [initialContent, setInitialContent] = useState(post.content);

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
        initialValue: initialContent,
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
  }, [initialContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editorInstance = editorRef.current;
    const content = editorInstance.getMarkdown();
    const title = e.target.title.value;
  
    const response = await fetch(`/api/posts/${post._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: post._id, title, content }),
    });
  
    if (response.ok) {
      alert('글이 수정되었습니다!');
      router.push(`/post/${post._id}`);
    } else {
      alert('글 수정을 실패했습니다...');
    }
  };
  

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="제목"
          defaultValue={post.title}
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
          수정하기
        </button>
      </form>
    </div>
  );
}
