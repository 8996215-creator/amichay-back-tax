import type { ReactNode } from 'react';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Accordion, type QA } from '@/components/ui/Accordion';
import { Mascot } from '@/components/ui/Mascot';

interface Props {
  eyebrow: string;
  title: string;
  items: QA[];
  /** Optional footer row under the accordion (links, a CTA). Rendered centered. */
  children?: ReactNode;
}

/** FAQ block shared by every page: Missy wonders next to the questions on desktop, above the heading on phones. */
export function FaqSection({ eyebrow, title, items, children }: Props) {
  return (
    <Section>
      <Container>
        <Reveal>
          <Mascot name="faq" float className="mx-auto mb-4 w-20 sm:w-24 lg:hidden" />
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 items-center">
          <Reveal delay={0.1} className="mx-auto w-full min-w-0 max-w-3xl">
            <Accordion items={items} />
          </Reveal>
          <Mascot name="faq" float className="hidden w-40 lg:block xl:w-52" />
        </div>
        {children && <div className="mt-8 text-center">{children}</div>}
      </Container>
    </Section>
  );
}
