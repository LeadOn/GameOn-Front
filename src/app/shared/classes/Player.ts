export class Player {
  id: number = 0;
  keycloakId?: string;
  fullName: string = '';
  nickname: string = '';
  profilePictureUrl: string = '';
  createdOn: Date = new Date();
  archived: boolean = false;
}
