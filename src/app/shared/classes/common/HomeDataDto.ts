import { Tournament } from '../fifa/Tournament';
import { Season } from '../Season';
import { Changelog } from './Changelog';

export class HomeDataDto {
  latestChangelog: Changelog = new Changelog();
  currentSeason: Season = new Season();
  featuredTournaments: Tournament[] = [];
}
