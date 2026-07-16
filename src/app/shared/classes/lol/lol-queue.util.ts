import { LoLQueue } from './LoLQueue';

export function queueLabel(
  queues: LoLQueue[],
  queueId: number | null,
  fallback: string = '',
): string {
  if (queueId == null) {
    return fallback;
  }

  const queue = queues.find((q) => q.id === queueId);

  if (queue == null) {
    return fallback;
  }

  return queue.description || queue.map;
}
