import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { base44 } from '@/api/base44Client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// ── Register a raw-HTML block embed ─────────────────────────────────────────
// Tables (inserted or pasted) are stored as raw HTML inside this embed.
// The embed is contenteditable so users can edit cells directly; an input
// listener syncs changes back to onChange.
const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import('blots/block/embed');

class RawHtmlEmbed extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.classList.add('ql-raw-html');
    node.setAttribute('contenteditable', 'true');
    if (typeof value === 'string') node.innerHTML = value;
    return node;
  }
  static value(node) {
    return node.innerHTML;
  }
}
RawHtmlEmbed.blotName = 'raw-html';
RawHtmlEmbed.tagName = 'div';
RawHtmlEmbed.className = 'ql-raw-html';
Quill.register(RawHtmlEmbed, true);

// Strip contenteditable attrs from saved HTML so they don't leak to the live page
const cleanHtml = (html) => (html || '').replace(/ contenteditable="(?:true|false)"/g, '');

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 180, onEditorReady }) {
  const quillRef = useRef(null);
  const [tableDialog, setTableDialog] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [imageDialog, setImageDialog] = useState(null); // { file_url }
  const [altText, setAltText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAlt, setSelectedAlt] = useState('');

  useEffect(() => {
    if (quillRef.current?.getEditor && onEditorReady) {
      onEditorReady(quillRef.current.getEditor());
    }
    return () => onEditorReady?.(null);
  }, [onEditorReady]);

  // Track clicked images for alt text editing
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const handleClick = (e) => {
      if (e.target.tagName === 'IMG') {
        setSelectedImage(e.target);
        setSelectedAlt(e.target.alt || '');
      } else {
        setSelectedImage(null);
        setSelectedAlt('');
      }
    };
    quill.root.addEventListener('click', handleClick);
    return () => quill.root.removeEventListener('click', handleClick);
  }, []);

  // Sync edits inside raw-html embeds (table cells) back to onChange
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const handleInput = (e) => {
      if (e.target.closest('.ql-raw-html')) {
        onChange(cleanHtml(quill.root.innerHTML));
      }
    };
    quill.root.addEventListener('input', handleInput);
    return () => quill.root.removeEventListener('input', handleInput);
  }, [onChange]);

  // Intercept paste when content contains tables — insert as raw HTML to
  // preserve the full <table>/<tr>/<td> structure from Word/Google Docs/etc.
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const handlePaste = (e) => {
      const html = e.clipboardData?.getData('text/html');
      if (!html || !html.toLowerCase().includes('<table')) return; // let Quill handle non-table paste
      e.preventDefault();
      e.stopPropagation();
      const range = quill.getSelection(true) || { index: 0 };
      // Clean up Office/Docs cruft but keep table structure
      const temp = document.createElement('div');
      temp.innerHTML = html;
      temp.querySelectorAll('script, style, meta, link').forEach((el) => el.remove());
      temp.querySelectorAll('*').forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith('o:') || attr.name.startsWith('v:') || (attr.name === 'class' && /mso/i.test(attr.value))) {
            el.removeAttribute(attr.name);
          }
        });
      });
      quill.insertEmbed(range.index, 'raw-html', temp.innerHTML);
      quill.setSelection(range.index + 1);
      onChange(cleanHtml(quill.root.innerHTML));
    };
    quill.root.addEventListener('paste', handlePaste, true);
    return () => quill.root.removeEventListener('paste', handlePaste, true);
  }, [onChange]);

  const emitChange = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) onChange(cleanHtml(quill.root.innerHTML));
  };

  const updateSelectedAlt = (val) => {
    setSelectedAlt(val);
    if (selectedImage) {
      selectedImage.setAttribute('alt', val);
      emitChange();
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
        setImageDialog({ file_url });
        setAltText('');
      } catch (err) {
        console.error(err);
      }
    };
  };

  const insertImage = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !imageDialog) return;
    const range = quill.getSelection(true) || { index: 0 };
    quill.insertEmbed(range.index, 'image', imageDialog.file_url);
    // Set alt text on the just-inserted image
    const imgs = quill.root.querySelectorAll(`img[src="${imageDialog.file_url}"]`);
    if (imgs.length > 0) imgs[imgs.length - 1].setAttribute('alt', altText);
    emitChange();
    setImageDialog(null);
    setAltText('');
  };

  const tableHandler = () => setTableDialog(true);

  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true) || { index: 0 };
    let html = '<table><tbody>';
    for (let i = 0; i < rows; i++) {
      html += '<tr>';
      for (let j = 0; j < cols; j++) html += '<td>&nbsp;</td>';
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    quill.insertEmbed(range.index, 'raw-html', html);
    quill.setSelection(range.index + 1);
    emitChange();
    setTableDialog(false);
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

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image', 'raw-html', 'blockquote'];

  return (
    <div>
      <div className="rich-text-editor" style={{ '--ql-min-height': `${minHeight}px` }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={(content) => onChange(cleanHtml(content))}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>

      {/* Alt text for a selected existing image */}
      {selectedImage && (
        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <Label className="text-xs">Alternative text for selected image</Label>
          <Input
            value={selectedAlt}
            onChange={(e) => updateSelectedAlt(e.target.value)}
            placeholder="Describe this image for readers with visual impairments"
            className="mt-1.5 text-sm"
          />
        </div>
      )}

      {/* Image insertion dialog with alt text */}
      <Dialog open={!!imageDialog} onOpenChange={(v) => !v && setImageDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Insert image</DialogTitle>
          </DialogHeader>
          {imageDialog && (
            <div className="space-y-3">
              <img src={imageDialog.file_url} alt="" className="max-h-48 mx-auto rounded-lg border border-slate-200 object-contain" />
              <div>
                <Label>Alternative text</Label>
                <Input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe this image for accessibility" className="mt-1.5" />
                <p className="mt-1 text-xs text-slate-400">Used by screen readers and shown when the image can't load.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialog(null)}>Cancel</Button>
            <Button onClick={insertImage}>Insert image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table insertion dialog — choose rows and columns */}
      <Dialog open={tableDialog} onOpenChange={setTableDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Insert table</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rows</Label>
              <Input type="number" min="1" max="20" value={rows} onChange={(e) => setRows(Math.max(1, Math.min(20, Number(e.target.value))))} className="mt-1.5" />
            </div>
            <div>
              <Label>Columns</Label>
              <Input type="number" min="1" max="10" value={cols} onChange={(e) => setCols(Math.max(1, Math.min(10, Number(e.target.value))))} className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTableDialog(false)}>Cancel</Button>
            <Button onClick={insertTable}>Insert table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}