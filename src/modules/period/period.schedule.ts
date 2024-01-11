import type { periods } from '@prisma/client';
import schedule from 'node-schedule';
import { isToday } from 'utils';

const scheduleTaskForPeriod = (period: periods) => {
  // Check if endDate is today and schedule a task

  if (isToday(period.endDate.toISOString())) {
    schedule.scheduleJob(period.endDate.toISOString(), () => {
      console.log(`Task for period ${period.id} is running.`);
      // Task logic here
    });
  }
};

export { scheduleTaskForPeriod };
