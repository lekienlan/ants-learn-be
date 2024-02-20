import type { periods } from '@prisma/client';
import { CronJob } from 'cron';
import { pigService } from 'modules/pig';
import { transactionService } from 'modules/transaction';
import prisma from 'prisma';

import { periodService } from '.';

const scheduledJobs: Record<string, CronJob> = {};

const scheduleTaskForPeriod = (period: periods) => {
  // Convert period.end_date to a cron pattern
  // Example: Assuming you want to run the job every day at the time specified by end_date
  const date = new Date(period.end_date);
  const cronPattern = `${date.getMinutes()} ${date.getHours()} * * *`;

  const job = new CronJob(
    cronPattern,
    async () => {
      console.log('running cron job for period id: ', period?.id);
      period.members.forEach(async (member) => {
        const expenseResp = await transactionService.findMany({
          user_id: member,
          type: 'expense',
          period_id: period.id
        });

        periodService.update(period.id, {
          status: 'completed'
        });

        pigService.update(period?.pig_id, {
          status: 'stopped'
        });

        transactionService.create({
          type: 'income',
          amount: period.budget - (expenseResp.total_amount || 0),
          user_id: member
        });
      });
      // Additional task logic here
    },
    null,
    true
  );

  job.start();
  console.log('running cron job for period id: ', period?.id);
  scheduledJobs[period.id] = job;
};

export const cancelScheduledTaskForPeriod = (period_id: string) => {
  const job = scheduledJobs[period_id];
  if (job) {
    job.stop();
    delete scheduledJobs[period_id];
    console.log(`Cancelled cron job for period id: ${period_id}`);
  }
};

const restartPeriodScheduledTasks = async () => {
  const periods = await prisma.periods.findMany({
    where: { status: { in: ['running'] } }
  }); // Fetch all periods from the database
  periods?.forEach(scheduleTaskForPeriod);
};

export { restartPeriodScheduledTasks, scheduleTaskForPeriod };
