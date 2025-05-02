// src/components/community/ShareContent.jsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Share2, Mail, Link as LinkIcon, X } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

const ShareContent = ({ contentType, contentId, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState(null);

  const shareMutation = useMutation({
    mutationFn: () => api.shareContent(contentType, contentId),
    onSuccess: () => {
      setShareMethod('general');
      trackEvent('content_share', { contentType, contentId, method: 'general' });
      setTimeout(() => setIsOpen(false), 2000);
    },
  });

  const emailShareMutation = useMutation({
    mutationFn: (recipientEmail) => api.shareViaEmail(contentType, contentId, recipientEmail),
    onSuccess: () => {
      setShareMethod('email');
      setEmail('');
      trackEvent('content_share', { contentType, contentId, method: 'email' });
      setTimeout(() => setIsOpen(false), 2000);
    },
  });

  const copyLinkMutation = useMutation({
    mutationFn: () => api.getShareLink(contentType, contentId),
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.url);
      setShowCopied(true);
      trackEvent('content_share', { contentType, contentId, method: 'link' });
      setTimeout(() => setShowCopied(false), 2000);
    },
  });

  const handleEmailShare = (e) => {
    e.preventDefault();
    if (email.trim()) {
      emailShareMutation.mutate(email);
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        const response = await api.getShareLink(contentType, contentId);
        await navigator.share({
          title: title || 'Shared content from Mama Afrika',
          text: 'Check out this content from Mama Afrika',
          url: response.data.url,
        });
        shareMutation.mutate();
      } else {
        copyLinkMutation.mutate();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-cyan-600 transition flex items-center gap-1"
        aria-label="Share"
      >
        <Share2 size={18} />
        <span className="text-sm">Share</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-sm relative animate-fade-in">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 sm:text-lg">Share Content</h3>
            
            {shareMethod === 'general' ? (
              <div className="text-center py-4 text-green-600">
                <p>Content shared successfully!</p>
              </div>
            ) : shareMethod === 'email' ? (
              <div className="text-center py-4 text-green-600">
                <p>Content shared via email successfully!</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    onClick={handleNativeShare}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Share2 size={24} className="text-cyan-600" />
                    </div>
                    <span className="text-sm">Share</span>
                  </button>
                  
                  <button
                    onClick={() => copyLinkMutation.mutate()}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                      <LinkIcon size={24} className="text-cyan-600" />
                    </div>
                    <span className="text-sm">{showCopied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 sm:text-sm">Share via Email</h4>
                  <form onSubmit={handleEmailShare} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 border rounded p-2 text-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition flex items-center gap-1 text-sm"
                    >
                      <Mail size={16} />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShareContent;
