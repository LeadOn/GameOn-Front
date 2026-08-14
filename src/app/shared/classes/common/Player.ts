import { Tournament } from '../fifa/Tournament';

export class Player {
  id: number = 0;
  keycloakId?: string;
  fullName: string = '';
  nickname: string = '';
  profilePictureUrl: string = 'default.webp';
  createdOn: Date = new Date();
  archived: boolean = false;
  tournamentsWon?: Tournament[];
}
