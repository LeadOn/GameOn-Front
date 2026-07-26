import { LoLQueue } from './LoLQueue';

/**
 * French display names for the queues this app actually shows. The GameOn
 * catalog mirrors Riot's own `queues.json`, whose `description` is English
 * ("5v5 Ranked Solo games") and reads as raw API data in an otherwise French
 * UI — so ids we know about are relabelled here and anything else falls back
 * to the catalog description.
 */
const QUEUE_LABELS: Record<number, string> = {
  0: 'Partie personnalisée',
  400: 'Normale (Draft)',
  420: 'Classée Solo/Duo',
  430: 'Normale (Aveugle)',
  440: 'Classée Flex',
  450: 'ARAM',
  480: 'Normale (Swiftplay)',
  490: 'Normale (Rapide)',
  700: 'Clash',
  720: 'Clash ARAM',
  830: 'Coop vs IA (Intro)',
  840: 'Coop vs IA (Débutant)',
  850: 'Coop vs IA (Intermédiaire)',
  870: 'Coop vs IA (Intro)',
  880: 'Coop vs IA (Débutant)',
  890: 'Coop vs IA (Intermédiaire)',
  900: 'ARURF',
  1020: 'Un pour tous',
  1300: 'Nexus Blitz',
  1400: 'Grimoire ultime',
  1700: 'Arena',
  1710: 'Arena (16 joueurs)',
  1900: 'URF',
  2000: 'Tutoriel',
  2010: 'Tutoriel',
  2020: 'Tutoriel',
};

export function queueLabel(
  queues: LoLQueue[],
  queueId: number | null,
  fallback: string = '',
): string {
  if (queueId == null) {
    return fallback;
  }

  const label = QUEUE_LABELS[queueId];

  if (label != null) {
    return label;
  }

  const queue = queues.find((q) => q.id === queueId);

  if (queue == null) {
    return fallback;
  }

  return queue.description || queue.map;
}
