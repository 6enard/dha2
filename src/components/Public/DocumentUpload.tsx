import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  onFileSelect: (file: File, type: 'resume' | 'coverLetter' | 'portfolio') => void;
  uploadedFiles: {
    resume?: File;
    coverLetter?: File;
    portfolio?: File;
  };
  onFileRemove: (type: 'resume' | 'coverLetter' | 'portfolio') => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onFileSelect, 
  uploadedFiles, 
  onFileRemove 
}) => {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'resume' | 'coverLetter' | 'portfolio') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file, type)) {
        onFileSelect(file, type);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'coverLetter' | 'portfolio') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file, type)) {
        onFileSelect(file, type);
      }
    }
  };

  const validateFile = (file: File, type: string): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF, DOC, DOCX, or TXT files only');
      return false;
    }

    return true;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else if (file.type.includes('word')) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    } else {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const UploadArea: React.FC<{
    type: 'resume' | 'coverLetter' | 'portfolio';
    title: string;
    description: string;
    required?: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
  }> = ({ type, title, description, required = false, inputRef }) => {
    const file = uploadedFiles[type];
    const isDragOver = dragOver === type;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {title} {required && <span className="text-red-500">*</span>}
        </label>
        
        {file ? (
          <div className="border border-gray-300 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <button
                type="button"
                onClick={() => onFileRemove(type)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => handleDragOver(e, type)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, type)}
          >
            <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium text-gray-900 mb-1">{description}</p>
            <p className="text-xs text-gray-600 mb-3">
              Drag and drop or{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT (max 10MB)</p>
            
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileSelect(e, type)}
              className="hidden"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Document Upload Guidelines</h4>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• Resume is required - other documents are optional</li>
              <li>• Documents are securely uploaded and available to HR for review</li>
              <li>• Accepted formats: PDF, DOC, DOCX, TXT</li>
              <li>• Maximum file size: 10MB per document</li>
              <li>• Ensure documents are up-to-date and relevant</li>
            </ul>
          </div>
        </div>
      </div>

      <UploadArea
        type="resume"
        title="Resume/CV"
        description="Upload your resume or CV"
        required
        inputRef={resumeInputRef}
      />

      <UploadArea
        type="coverLetter"
        title="Cover Letter"
        description="Upload your cover letter (optional)"
        inputRef={coverLetterInputRef}
      />

      <UploadArea
        type="portfolio"
        title="Portfolio"
        description="Upload your portfolio or work samples (optional)"
        inputRef={portfolioInputRef}
      />
    </div>
  );
};

export default DocumentUpload;