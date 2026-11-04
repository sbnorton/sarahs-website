import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import styles from './ContactForm.module.css';

const MAX_MESSAGE_LENGTH = 2000;

interface FormValues {
  name: string;
  email: string;
  message: string;
  website: string;
}

interface TurnstileInstance {
  render: (
    container: HTMLElement,
    options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void },
  ) => string;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
}

const initialValues: FormValues = { name: '', email: '', message: '', website: '' };

function contactEndpoint(): string | null {
  const configuredUrl = import.meta.env.PUBLIC_PHOTOS_API_URL;
  if (!configuredUrl) return null;
  return `${configuredUrl.replace(/\/photos\/?$/, '')}/contact`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: FormValues): string | null {
  if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
    return 'Please complete all required fields.';
  }
  if (!isValidEmail(values.email.trim())) return 'Please enter a valid email address.';
  if (values.message.trim().length > MAX_MESSAGE_LENGTH) {
    return `Your message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }
  return null;
}

async function loadTurnstile(): Promise<void> {
  if (window.turnstile) return;
  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="turnstile/v0/api.js"]',
    );
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Turnstile could not load.')),
        { once: true },
      );
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Turnstile could not load.')), {
      once: true,
    });
    document.head.appendChild(script);
  });
}

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [statusTone, setStatusTone] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !turnstileRef.current) return;
    const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      setStatus('The contact form is not configured yet.');
      setStatusTone('error');
      return;
    }
    let cancelled = false;
    void loadTurnstile()
      .then(() => {
        if (!cancelled && window.turnstile && turnstileRef.current) {
          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            callback: setToken,
            'expired-callback': () => setToken(''),
          });
        }
      })
      .catch(() => {
        setStatus('Spam protection could not load. Please try again later.');
        setStatusTone('error');
      });
    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
      widgetIdRef.current = undefined;
      setToken('');
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setStatus('');
    setStatusTone('idle');
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate(values);
    if (validationError) {
      setStatus(validationError);
      setStatusTone('error');
      return;
    }
    if (!token) {
      setStatus('Please complete the spam protection check.');
      setStatusTone('error');
      return;
    }
    const endpoint = contactEndpoint();
    if (!endpoint) {
      setStatus('The contact form is not configured yet.');
      setStatusTone('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('');
    setStatusTone('idle');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          turnstileToken: token,
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const error =
          result &&
          typeof result === 'object' &&
          'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : 'Your message could not be sent.';
        throw new Error(error);
      }
      setValues(initialValues);
      setToken('');
      setStatus('Thanks! Your message has been sent.');
      setStatusTone('success');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Your message could not be sent. Please try again.',
      );
      setStatusTone('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className={styles.trigger} type="button" onClick={() => setIsOpen(true)}>
        Get in touch
      </button>
      {isOpen && (
        <div
          className={styles.backdrop}
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && close()}
        >
          <div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            tabIndex={-1}
          >
            <button
              className={styles.close}
              type="button"
              aria-label="Close contact form"
              onClick={close}
            >
              ×
            </button>
            <h2 id="contact-title" className={styles.title}>
              Get in touch
            </h2>
            <p className={styles.intro}>Tell me a little about your project or question.</p>
            <form className={styles.form} onSubmit={submit}>
              <div className={styles.field}>
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  value={values.name}
                  onChange={(event) => setValues({ ...values, name: event.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  onChange={(event) => setValues({ ...values, email: event.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={values.message}
                  onChange={(event) => setValues({ ...values, message: event.target.value })}
                />
              </div>
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(event) => setValues({ ...values, website: event.target.value })}
                />
              </div>
              <div ref={turnstileRef} />
              <p
                className={`${styles.status} ${statusTone === 'error' ? styles.error : ''}`}
                aria-live="polite"
              >
                {status}
              </p>
              <button className={styles.submit} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
