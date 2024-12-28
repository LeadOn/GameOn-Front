import { Season } from '../Season';
import { Tournament } from '../Tournament';
import { Changelog } from './Changelog';

export class HomeDataDto {
  latestChangelog: Changelog = new Changelog();
  currentSeason: Season = new Season();
  featuredTournaments: Tournament[] = [];
}
