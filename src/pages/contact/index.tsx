import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Send } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, Input, Textarea } from 'nfx-ui/components'
import { z } from 'zod'

import { Reveal } from '@/animations'
import { PageIntro } from '@/components'
import { SignalDiagram } from '@/elements/world/components/SignalDiagram'
import { useScrollAtmosphere } from '@/elements/world/hooks/useScrollAtmosphere'
import { useProfileQuery } from '@/hooks'
import styles from './styles.module.css'

type ContactFormValues = {
  name: string
  email: string
  company?: string
  message: string
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const { t } = useTranslation(['common', 'contact'])
  const { data: profile } = useProfileQuery()
  const gridRef = useRef<HTMLElement | null>(null)
  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('contactForm.errors.name')),
        email: z.string().email(t('contactForm.errors.email')),
        company: z.string().optional(),
        message: z.string().min(24, t('contactForm.errors.message')),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: '',
    },
  })

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    setSubmitted(true)
    reset()
  })

  useScrollAtmosphere(gridRef, { selector: '[data-contact-card]', mood: 'beacon' })

  return (
    <div className={styles.page}>
      <Reveal>
        <PageIntro
          eyebrow={t('contact:intro.eyebrow')}
          title={t('contact:intro.title')}
          description={t('contact:intro.description')}
        />
      </Reveal>

      <section ref={gridRef} className={styles.grid} data-page-chunk>
        <Reveal delay={0.06}>
          <div className={styles.panel} data-contact-card>
            <p className={styles.kicker}>{t('labels.reachOutDirectly')}</p>
            <div className={styles.diagramWrap}>
              <SignalDiagram variant="contact" />
            </div>
            <div className={styles.methods}>
              {profile?.contactMethods.map((method) => (
                <a key={method.label} href={method.href} className={styles.method}>
                  <span>{method.label}</span>
                  <strong>{method.value}</strong>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form className={styles.form} onSubmit={onSubmit} data-contact-card>
            <div className={styles.row}>
              <Input
                label={t('contactForm.name')}
                placeholder={t('contactForm.namePlaceholder')}
                error={errors.name?.message}
                leftIcon={<Mail size={16} />}
                {...register('name')}
              />
              <Input
                label={t('contactForm.email')}
                placeholder={t('contactForm.emailPlaceholder')}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <Input
              label={t('contactForm.company')}
              placeholder={t('contactForm.companyPlaceholder')}
              error={errors.company?.message}
              {...register('company')}
            />
            <Textarea
              label={t('contactForm.message')}
              placeholder={t('contactForm.messagePlaceholder')}
              error={errors.message?.message}
              rows={6}
              {...register('message')}
            />

            <div className={styles.submitRow}>
              <Button type="submit" loading={isSubmitting} leftIcon={<Send size={16} />}>
                {t('actions.sendInquiry')}
              </Button>
              {submitted ? <p className={styles.success}>{t('contactForm.success')}</p> : null}
            </div>
          </form>
        </Reveal>
      </section>
    </div>
  )
}

export { ContactPage }
