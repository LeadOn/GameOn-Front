export class CreateChangelogDto {
  name?: string;
  type: number = 0;
  version: string = '';
  context?: string;
  newFeatures?: string[];
  updatedFeatures?: string[];
  removedFeatures?: string[];
  published: boolean = false;
}
