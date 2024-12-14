import { Tournament } from './Tournament';

export class Player {
  id: number = 0;
  keycloakId?: string;
  fullName: string = '';
  nickname: string = '';
  profilePictureUrl: string = 'assets/img/gameon-logo.webp';
  createdOn: Date = new Date();
  archived: boolean = false;
  tournamentsWon?: Tournament[];
}
