export class Changelog {
  id: number = 0;
  name?: string;
  publicationDate: Date = new Date();
  type: number = 0;
  version: string = '';
  context?: string;
  newFeatures?: string[];
  updatedFeatures?: string[];
  removedFeatures?: string[];
}
