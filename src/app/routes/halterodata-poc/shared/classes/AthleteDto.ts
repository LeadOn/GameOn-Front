export class AthleteDto {
  id: number = 0;
  licenceId: number = 0;
  fullName: string = 'DEFAULT NAME';
  birthDate?: Date;
  type: number = 0;
  countryCode: string = 'FR';
  currentClub?: string;
  lastSnatch?: number;
  lastCj?: number;
  lastTotal?: number;
  lastIwf?: number;
  lastBodyWeight?: number;
}
