import { tokenService } from 'modules/token';
import moment from 'moment';

export const token = tokenService.generate(
  'test-user-id',
  moment().add(30, 'day')
);
