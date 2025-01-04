import { Season } from '../fifa/Season';
import { Tournament } from '../fifa/Tournament';
import { Changelog } from './Changelog';

export class HomeDataDto {
  latestChangelog: Changelog = new Changelog();
  currentSeason: Season = new Season();
  featuredTournaments: Tournament[] = [];
}
