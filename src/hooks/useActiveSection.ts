import { useEffect, useState, type RefObject } from 'react';
import type { SectionLink } from '../types/content';

export function useActiveSection(
  sections: SectionLink[],
  enabled: boolean,
  header: RefObject<HTMLElement | null>,
) {
  const [activeSection, setActiveSection] = useState<string>();

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;

    function update() {
      frame = 0;
      const readingLine =
        (header.current?.getBoundingClientRect().bottom ?? 0) + 24;
      const elements = sections.flatMap(({ id }) => {
        const element = document.getElementById(id);
        return element ? [element] : [];
      });
      let current: string | undefined;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= readingLine)
          current = element.id;
      }

      // A última seção pode ser curta demais para alcançar a linha do header.
      const last = elements.at(-1);
      const atBottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2;
      if (
        atBottom &&
        last &&
        last.getBoundingClientRect().top < window.innerHeight
      )
        current = last.id;
      setActiveSection(current);
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    const observer = window.ResizeObserver
      ? new ResizeObserver(scheduleUpdate)
      : undefined;
    const content = document.getElementById('main-content');
    if (content) observer?.observe(content);
    if (header.current) observer?.observe(header.current);
    scheduleUpdate();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [sections, enabled, header]);

  return enabled ? activeSection : undefined;
}
