import React, { useState } from 'react';
import { Check, X, Edit2 } from 'lucide-react';

interface EditableSectionProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  children
}) => {
  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={onCancel}
                className="flex items-center px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="flex items-center px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </button>
          )}
        </div>
      </div>
      {children}
    </section>
  );
};

export default EditableSection;