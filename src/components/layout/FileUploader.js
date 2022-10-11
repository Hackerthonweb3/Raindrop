import { createRef, useEffect, useRef, useState } from "react"

const FileUploader = ({ children, setFile, accept = '', multiple = false, setDragging }) => {

    const ref = useRef(null);
    const dropRef = useRef(null);

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // if(e.target != dropRef.current) {
        // setDragging && setDragging(true);
        // }
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (setDragging && e.target == dropRef.current) {
            setDragging(false);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        //TODO check file
        setFile(e.dataTransfer.files[0]);
    }

    const removeListeners = (div) => {
        div.removeEventListener('dragenter', handleDragEnter)
        div.removeEventListener('dragleave', handleDragLeave)
        div.removeEventListener('dragover', handleDragOver)
        div.removeEventListener('drop', handleDrop)
    }

    useEffect(() => {
        const div = dropRef.current;
        div.addEventListener('dragenter', handleDragEnter)
        div.addEventListener('dragleave', handleDragLeave)
        div.addEventListener('dragover', handleDragOver)
        div.addEventListener('drop', handleDrop)

        return (() => removeListeners(div));
    }, [])


    return (
        <>
            <input type='file' onChange={handleChange} ref={ref} style={{ display: 'none' }} accept={accept} multiple={multiple} />
            <div ref={dropRef} style={{ width: '100%' }} onClick={() => ref.current.click()}>
                {children}
            </div>
        </>
    )
}

export default FileUploader;