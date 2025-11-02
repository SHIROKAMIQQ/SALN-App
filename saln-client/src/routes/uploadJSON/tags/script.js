let fileInput;
let onFileSelected; 

export function handleClick(callback) { 
    onFileSelected = callback; 
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,application/json';
        fileInput.multiple = true;
        fileInput.onchange = handleFileChange;
    }
    fileInput.click();
}

function handleFileChange(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        console.log("Selected files:", files.map(f => f.name));
        // Call the callback to update the UI
        if (onFileSelected) {
            onFileSelected(files);
        }
    }
}

// Drag and drop functions
export function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

export function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
}

export function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
}

export function handleDrop(e, callback) {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFiles = files.filter(file => 
        file.type === 'application/json' || file.name.endsWith('.json')
    );
    
    if (jsonFiles.length > 0) {
        console.log("Dropped files:", jsonFiles.map(f => f.name));
        if (callback) {
            callback(jsonFiles);
        }
    } else {
        console.error("Please drop JSON files only");
    }
}