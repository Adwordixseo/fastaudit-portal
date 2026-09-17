import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { base44 } from '@/api/base44Client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Register custom table blots with Quill so tables are preserved as real
// <table>/<tr>/<td> markup in both the editor and the saved HTML output.
const Quill = ReactQuill.Quill;
const Container = Quill.import('blots/container');
const Block = Quill.import('blots/block');

class TableBlot extends Container {
  static create() { const node = super.create(); return node; }
}
TableBlot.blotName = 'table';
TableBlot.tagName = 'TABLE';

class TableBodyBlot extends Container {
  static create() { return super.create(); }
}
TableBodyBlot.blotName = 'table-body';
TableBodyBlot.tagName = 'TBODY';

class TableRowBlot extends Container {
  static create() { return super.create(); }
}
TableRowBlot.blotName = 'table-row';
TableRowBlot.tagName = 'TR';

class TableCellBlot extends Block {
  static create() { return super.create(); }
}
TableCellBlot.blotName = 'table-cell';
TableCellBlot.tagName = 'TD';

class TableHeaderCellBlot extends Block {
  static create() { return super.create(); }
}
TableHeaderCellBlot.blotName = 'table-header-cell';
TableHeaderCellBlot.tagName = 'TH';

TableBlot.allowedChildren = [TableRowBlot, TableBodyBlot];
TableBodyBlot.allowedChildren = [TableRowBlot];
TableRowBlot.allowedChildren = [TableCellBlot, TableHeaderCellBlot];

Quill.register({
  'formats/table': TableBlot,
  'formats/table-body': TableBodyBlot,
  'formats/table-row': TableRowBlot,
  'formats/table-cell': TableCellBlot,
  'formats/table-header-cell': TableHeaderCellBlot,
}, true);

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 180, maxHeight = 320, onEditorReady }) {
  const quillRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [altText, setAltText] = useState('');

  useEffect(() => {
    if (quillRef.current?.getEditor && onEditorReady) {
      onEditorReady(quillRef.current.getEditor());
    }
    return () => onEditorReady?.(null);
  }, [onEditorReady]);

  // Alt text: track clicked images and show an input below the editor
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const handleClick = (e) => {
      if (e.target.tagName === 'IMG') {
        setSelectedImage(e.target);
        setAltText(e.target.alt || '');
      } else {
        setSelectedImage(null);
        setAltText('');
      }
    };
    quill.root.addEventListener('click', handleClick);
    return () => quill.root.removeEventListener('click', handleClick);
  }, []);

  const updateAlt = (val) => {
    setAltText(val);
    if (selectedImage) {
      selectedImage.setAttribute('alt', val);
      const quill = quillRef.current?.getEditor();
      if (quill) onChange(quill.root.innerHTML);
    }
  };

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

  const tableHandler = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true);
    const tableHtml = '<table><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></tbody></table><p><br></p>';
    quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'table', 'blockquote'],
        ['clean'],
      ],
      handlers: { image: imageHandler, table: tableHandler },
    },
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image', 'table', 'table-body', 'table-row', 'table-cell', 'table-header-cell', 'blockquote'];

  return (
    <div>
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
      {selectedImage && (
        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <Label className="text-xs">Alternative text</Label>
          <Input
            value={altText}
            onChange={(e) => updateAlt(e.target.value)}
            placeholder="Write a brief description of this image for readers with visual impairments"
            className="mt-1.5 text-sm"
          />
          <p className="mt-1 text-xs text-slate-400">Click an image to edit its alt text. Click away from an image to hide this field.</p>
        </div>
      )}
    </div>
  );
}