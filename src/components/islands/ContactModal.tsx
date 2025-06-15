import { useState } from 'react';
import { Button } from '@/components/common';
import { ContactForm } from '@/components/forms/ContactForm';
import { MessageCircle, X } from 'lucide-react';

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="secondary"
        size="lg"
        className="flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        お問い合わせ
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                お問い合わせ
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="閉じる"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      )}
    </>
  );
}