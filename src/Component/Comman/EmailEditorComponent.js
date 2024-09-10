import React, { forwardRef, useEffect } from 'react';
import EmailEditor from 'react-email-editor';

const EmailEditorComponent = forwardRef(({ exportHtml, onLoad, style = { height: 600 }, mailTemplate, onChange }, ref) => {

    useEffect(() => {
        const initializeEditor = () => {
            if (ref.current && ref.current.editor) {
                ref.current.editor.loadDesign(mailTemplate);
                ref.current.editor.addEventListener('design:updated', onChange);
            } else {
                console.error("Email editor reference is not available yet.");
            }
        };

        const observer = new MutationObserver(() => {
            if (ref.current) {
                initializeEditor();
                observer.disconnect();
            }
        });

        if (ref.current) {
            initializeEditor();
        } else {
            observer.observe(document, { childList: true, subtree: true });
        }

        return () => {
            if (ref.current && ref.current.editor) {
                ref.current.editor.removeEventListener('design:updated', onChange);
            }
        };
    }, [mailTemplate, onChange,ref]);

    return (
        <div className="email-editor-wrap">
            <EmailEditor
                ref={ref}
                exportHtml={exportHtml}
                onLoad={onLoad}
                style={style}
            />
        </div>
    );
});

export default EmailEditorComponent;
