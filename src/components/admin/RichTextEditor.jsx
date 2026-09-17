import React, { useRef, useEffect, useState, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { base44 } from '@/api/base44Client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// ── Register table blots (wrapped in try-catch so a registration failure
// doesn't crash the entire editor module) ────────────────────────────────────
let tableBlotsReady = false;
try {
  const Quill = ReactQuill.Quill;
  const Container = Quill.import('blots/container');
  const Block = Quill.import('blots/block');

  // Copy attributes from a source DOM node to the newly-created blot node,
  // skipping Office/VML cruft. This is what lets pasted tables keep their
  // widths, styles, colspan/rowspan, etc.
  function copyAttrs(source, target) {
    if (source && source instanceof HTMLElement) {
      [...source.attributes].forEach((attr) => {
        if (attr.name.startsWith('o:') || attr.name.startsWith('v:')) return;
        if (attr.name === 'class' && /mso/i.test(attr.value)) return;
        target.setAttribute(attr.name, attr.value);
      });
    }
    return target;
  }

  class TableBlot extends Container {
    static create(value) { return copyAttrs(value, super.create()); }
  }
  TableBlot.blotName = 'table';
  TableBlot.tagName = 'TABLE';

  class TableHeaderSectionBlot extends Container {
    static create(value) { return copyAttrs(value, super.create()); }
  }
  TableHeaderSectionBlot.blotName = 'table-header-section';
  TableHeaderSectionBlot.tagName = 'THEAD';

  class TableBodyBlot extends Container {
    static create(value) { return copyAttrs(value, super.create()); }
  }
  TableBodyBlot.blotName = 'table-body';
  TableBodyBlot.tagName = 'TBODY';

  class TableRowBlot extends Container {
    static create(value) { return copyAttrs(value, super.create()); }
  }
  TableRowBlot.blotName = 'table-row';
  TableRowBlot.tagName = 'TR';

  class TableCellBlot extends Block {
    static create(value) { return copyAttrs(value, super.create()); }
  }
  TableCellBlot.blotName = 'table-cell';
  TableCellBlot.tagName = 'TD';

  class TableHeaderCellBlot extends Block {
    static create(value) { return copyAttrs(value, super.create()); }
  }
  TableHeaderCellBlot.blotName = 'table-header-cell';
  TableHeaderCellBlot.tagName = 'TH';

  TableBlot.allowedChildren = [TableHeaderSectionBlot, TableBodyBlot, TableRowBlot];
  TableHeaderSectionBlot.allowedChildren = [TableRowBlot];
  TableBodyBlot.allowedChildren = [TableRowBlot];
  TableRowBlot.allowedChildren = [TableCellBlot, TableHeaderCellBlot];

  Quill.register({
    'formats/table': TableBlot,
    'formats/table-header-section': TableHeaderSectionBlot,
    'formats/table-body': TableBodyBlot,
    'formats/table-row': TableRowBlot,
    'formats/table-cell': TableCellBlot,
    'formats/table-header-cell': TableHeaderCellBlot,
  }, true);
  tableBlotsReady = true;
} catch (e) {
  console.error('Table blot registration failed:', e);
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 180, onEditorReady }) {
  const quillRef = useRef(null);
  const [tablePanel, setTablePanel] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [imagePanel, setImagePanel] = useState(null); // { file_url }
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

  // Intercept paste when content contains tables — clean Office/Docs cruft
  // then let Quill's clipboard parse the HTML with our registered table blots.
  // The blots copy attributes from the source nodes so formatting survives.
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const handlePaste = (e) => {
      const html = e.clipboardData?.getData('text/html');
      if (!html || !html.toLowerCase().includes('<table')) return;
      e.preventDefault();
      e.stopPropagation();
      const range = quill.getSelection(true) || { index: 0 };
      const temp = document.createElement('div');
      temp.innerHTML = html;
      // Remove Office cruft nodes entirely
      temp.querySelectorAll('script, style, meta, link, o:p, v:shape').forEach((el) => el.remove());
      // Strip Office-specific attributes but keep style, width, colspan, rowspan, etc.
      temp.querySelectorAll('*').forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith('o:') || attr.name.startsWith('v:')) {
            el.removeAttribute(attr.name);
          }
          if (attr.name === 'class' && /mso/i.test(attr.value)) {
            el.removeAttribute(attr.name);
          }
        });
      });
      // Ensure every table has a tbody (Quill requires it for the blot hierarchy)
      temp.querySelectorAll('table').forEach((table) => {
        if (!table.querySelector('tbody')) {
          const tbody = document.createElement('tbody');
          [...table.querySelectorAll('tr')].forEach((tr) => {
            if (tr.parentElement === table) tbody.appendChild(tr);
          });
          table.appendChild(tbody);
        }
      });
      quill.focus();
      quill.setSelection(range.index, 0);
      // Insert directly into the DOM to preserve table structure and formatting
      const ok = document.execCommand('insertHTML', false, temp.innerHTML);
      if (!ok) quill.clipboard.dangerouslyPasteHTML(range.index, temp.innerHTML);
      onChange(quill.root.innerHTML);
    };
    quill.root.addEventListener('paste', handlePaste, true);
    return () => quill.root.removeEventListener('paste', handlePaste, true);
  }, [onChange]);

  const updateSelectedAlt = (val) => {
    setSelectedAlt(val);
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
        setImagePanel({ file_url });
        setAltText('');
      } catch (err) {
        console.error(err);
      }
    };
  };

  const insertImage = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !imagePanel) return;
    const range = quill.getSelection(true) || { index: 0 };
    quill.insertEmbed(range.index, 'image', imagePanel.file_url);
    const imgs = quill.root.querySelectorAll(`img[src="${imagePanel.file_url}"]`);
    if (imgs.length > 0) imgs[imgs.length - 1].setAttribute('alt', altText);
    onChange(quill.root.innerHTML);
    setImagePanel(null);
    setAltText('');
  };

  const tableHandler = () => setTablePanel((v) => !v);

  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true) || { index: 0 };
    let html = '<table>';
    if (includeHeader) {
      html += '<thead><tr>';
      for (let j = 0; j < cols; j++) html += '<th>Header</th>';
      html += '</tr></thead>';
    }
    html += '<tbody>';
    for (let i = 0; i < rows; i++) {
      html += '<tr>';
      for (let j = 0; j < cols; j++) html += '<td>&nbsp;</td>';
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    quill.focus();
    quill.setSelection(range.index, 0);
    // Insert directly into the DOM — dangerouslyPasteHTML converts to a delta
    // which flattens and strips the table structure.
    const ok = document.execCommand('insertHTML', false, html);
    if (!ok) quill.clipboard.dangerouslyPasteHTML(range.index, html);
    onChange(quill.root.innerHTML);
    setTablePanel(false);
  };

  // Memoize modules so ReactQuill doesn't re-initialize on every render
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'table', 'blockquote'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
        table: tableHandler,
      },
    },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image', 'table', 'table-header-section', 'table-body', 'table-row', 'table-cell', 'table-header-cell', 'blockquote'];

  return (
    <div>
      <div className="rich-text-editor" style={{ '--ql-min-height': `${minHeight}px` }}>
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

      {/* Image insertion panel with alt text */}
      {imagePanel && (
        <div className="mt-2 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4">
          <div className="flex items-start gap-4">
            <img src={imagePanel.file_url} alt="" className="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
            <div className="flex-1">
              <Label>Alternative text</Label>
              <Input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe this image for accessibility" className="mt-1.5" />
              <p className="mt-1 text-xs text-slate-400">Used by screen readers and shown when the image can't load.</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => { setImagePanel(null); setAltText(''); }}>Cancel</Button>
            <Button size="sm" onClick={insertImage}>Insert image</Button>
          </div>
        </div>
      )}

      {/* Table insertion panel — choose rows, columns, and header row */}
      {tablePanel && (
        <div className="mt-2 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <Label>Rows</Label>
              <Input type="number" min="1" max="20" value={rows} onChange={(e) => setRows(Math.max(1, Math.min(20, Number(e.target.value))))} className="mt-1.5 w-24" />
            </div>
            <div>
              <Label>Columns</Label>
              <Input type="number" min="1" max="10" value={cols} onChange={(e) => setCols(Math.max(1, Math.min(10, Number(e.target.value))))} className="mt-1.5 w-24" />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Checkbox id="table-header" checked={includeHeader} onCheckedChange={setIncludeHeader} />
              <Label htmlFor="table-header" className="text-sm text-slate-600 cursor-pointer">Header row</Label>
            </div>
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={() => setTablePanel(false)}>Cancel</Button>
            <Button size="sm" onClick={insertTable}>Insert table</Button>
          </div>
          <p className="mt-2 text-xs text-slate-400">Tip: you can also paste tables directly from Google Docs, Excel, or Word — formatting is preserved.</p>
        </div>
      )}
    </div>
  );
}