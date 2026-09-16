import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { base44 } from '@/api/base44Client';

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 180, maxHeight = 320, onEditorReady }) {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current?.getEditor && onEditorReady) {
      onEditorReady(quillRef.current.getEditor());
    }
    return () => onEditorReady?.(null);
  }, [onEditorReady]);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', file_url);
          quill.setSelection(range.index + 1);
        }
      } catch (e) {
        console.error(e);
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'blockquote'],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image', 'blockquote'];

  return (
    <div className="rich-text-editor" style={{ '--ql-min-height': `${minHeight}px`, '--ql-max-height': `${maxHeight}px` }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}