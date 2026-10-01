import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  HiCheckCircle,
  HiClock,
  HiEnvelope,
  HiMapPin,
  HiPhone,
} from 'react-icons/hi2';
import { Seo } from '../../components/Seo.jsx';
import { Container } from '../../components/Container.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';

const CHANNELS = [
  { key: 'showroom', icon: HiMapPin },
  { key: 'email', icon: HiEnvelope },
  { key: 'phone', icon: HiPhone },
  { key: 'hours', icon: HiClock },
];

const SUBJECTS = ['inquiry', 'appointment', 'order', 'other'];

export default function ContactPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', phone: '', subject: 'inquiry', message: '' },
  });

  const onSubmit = () => {
    setSubmitted(true);
    reset();
  };

  const channels = CHANNELS.map(({ key, icon }) => ({
    label: t(`pages:contact.${key}`),
    value: t(`pages:contact.${key}Value`),
    icon,
  }));

  return (
    <>
      <Seo title={t('pages:contact.title')} description={t('pages:contact.hero')} />

      <header className="bg-gradient-to-b from-[#044B4A] to-[#002045] text-white">
        <Container className="py-16 lg:py-20">
          <h1 className="font-display text-4xl font-bold lg:text-5xl">{t('pages:contact.title')}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 lg:text-base">
            {t('pages:contact.hero')}
          </p>
        </Container>
      </header>

      <Container className="py-12 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_26rem]">
          <section aria-label={t('pages:contact.formTitle')}>
            {submitted ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-100 bg-bg-secondary px-6 py-16 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-secondary-100 text-secondary-500">
                  <HiCheckCircle aria-hidden="true" className="size-8" />
                </span>
                <h2 className="font-display text-2xl font-bold text-base-dark">
                  {t('pages:contact.sentTitle')}
                </h2>
                <p className="max-w-md text-sm leading-7 text-hue-500">
                  {t('pages:contact.sentBody')}
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  {t('pages:contact.sentAnother')}
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-5 rounded-2xl border border-border-100 bg-white p-6 lg:p-8"
              >
                <h2 className="font-display text-xl font-bold text-base-dark">
                  {t('pages:contact.formTitle')}
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label={t('auth:fields.name')}
                    placeholder={t('auth:fields.name')}
                    autoComplete="name"
                    error={errors.name?.message}
                    {...register('name', {
                      required: t('validation:required'),
                    })}
                  />
                  <Input
                    label={t('auth:fields.email')}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email', {
                      required: t('validation:required'),
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: t('validation:email'),
                      },
                    })}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label={t('auth:fields.phone')}
                    type="tel"
                    placeholder="+2 …"
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9+\s-]{8,}$/,
                        message: t('validation:phone'),
                      },
                    })}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-subject" className="text-sm font-medium text-base-dark">
                      {t('pages:contact.subject')}
                    </label>
                    <select
                      id="contact-subject"
                      className="h-12 w-full rounded-xl border border-border-100 bg-white px-4 text-sm text-base-dark transition-colors duration-200 focus:border-secondary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/30"
                      {...register('subject')}
                    >
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {t(`pages:contact.subjects.${subject}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Textarea
                    label={t('pages:contact.message')}
                    rows={6}
                    placeholder={t('pages:contact.messagePlaceholder')}
                    error={errors.message?.message}
                    {...register('message', {
                      required: t('validation:required'),
                      minLength: {
                        value: 10,
                        message: t('validation:minLength', { count: 10 }),
                      },
                    })}
                  />
                </div>

                <Button type="submit" size="lg" loading={isSubmitting} className="sm:self-start">
                  {t('pages:contact.send')}
                </Button>
              </form>
            )}
          </section>

          <aside className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-base-dark">
              {t('pages:contact.infoTitle')}
            </h2>
            <ul className="flex flex-col gap-3">
              {channels.map(({ label, value, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-start gap-4 rounded-2xl border border-border-100 bg-white p-5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-100 text-secondary-500">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-hue-500">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-base-dark">
                      <a
                        href={
                          label === t('pages:contact.email')
                            ? `mailto:${value}`
                            : label === t('pages:contact.phone')
                              ? `tel:${value.replace(/[^0-9+]/g, '')}`
                              : undefined
                        }
                        className="transition-colors hover:text-primary-500"
                      >
                        {value}
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </>
  );
}