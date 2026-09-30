import React from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

const DeleteCandidateModal = ({
  isOpen,
  onClose,
  onConfirm,
  candidateName = 'this candidate',
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isDeleting ? undefined : onClose}>
      <div
        className="modal-dialog animate-fade-in"
        style={{ textAlign: 'center', maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <Trash2 size={24} />
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: 8,
          }}
        >
          Delete Candidate?
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#64748b',
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          Are you sure you want to remove <strong>{candidateName}</strong> from the pipeline? This action will permanently delete their profile and AI match evaluation.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isDeleting}
            style={{ opacity: isDeleting ? 0.6 : 1, cursor: isDeleting ? 'not-allowed' : 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: isDeleting ? 0.7 : 1,
              cursor: isDeleting ? 'not-allowed' : 'pointer',
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Candidate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCandidateModal;
