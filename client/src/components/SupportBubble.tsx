import { useState } from 'react';

const SupportBubble = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Support panel */}
      <div className={`support-panel ${open ? 'is-open' : ''}`}>
        <div className="support-header">
            <h4>Freaky Fashion</h4>
            <p>Customer Support</p>
        </div>

        <div className="support-body">
            <p className="float-item">Hi! 👋</p>

            <p className="float-item">
            Our customer support is available
            <strong> 10:00 – 19:00, Monday to Sunday</strong>.
            </p>

            <p className="float-item">
            Leave us a message and we’ll get back to you as soon as possible.
            </p>
        </div>

        <a
            href="mailto:support@freakyfashion.com"
            className="btn-theme support-cta"
        >
            Contact support
        </a>
      </div>

      {/* Bubble / Close button */}
      <button
        className={`support-bubble ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close support' : 'Open support'}
      >
        {open ? (
          <span className="close-x">✕</span>
        ) : (
          <img
            src="/images/support-bubble.png"
            alt="Support"
          />
        )}
      </button>
    </>
  );
};

export default SupportBubble;
