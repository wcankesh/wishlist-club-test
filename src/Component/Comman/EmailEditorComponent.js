import React, { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import EmailEditor from 'react-email-editor';

const EmailEditorComponent = forwardRef(({ saveSetting, dataJson, onDesignChange }, ref) => {
    const editorRef = useRef(null);

    // Expose editor instance to parent via ref
    useImperativeHandle(ref, () => ({
        editor: editorRef.current?.editor,
    }));

    const exportHtmlCode = () => {
        if (editorRef.current && editorRef.current.editor) {
            editorRef.current.editor.exportHtml((data) => {
                const { design, html } = data;
            });
        }
    };

    const onLoadCode = () => {
        if (editorRef.current && editorRef.current.editor) {
            editorRef.current.editor.loadDesign(dataJson);
            editorRef.current.editor.addEventListener('design:updated', onDesignChange);
        } else {
            console.warn('Editor is not available yet.');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (editorRef.current) {
                onLoadCode();
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
            if (editorRef.current && editorRef.current.editor) {
                editorRef.current.editor.removeEventListener('design:updated', onDesignChange);
            }
        };
    }, [dataJson]);

    return (
        <div className='email-editor-wrap'>
            <EmailEditor
                ref={editorRef}
                saveDesign={saveSetting}
                exportHtml={exportHtmlCode}
                onLoad={onLoadCode}
                style={{ height: 600 }}
            />
        </div>
    );
});

export default EmailEditorComponent;
