import type { periods } from '@prisma/client';
import { CronJob } from 'cron';
import { transactionService } from 'modules/transaction';
import moment from 'moment';
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
      periodService.update(period.id, {
        status: 'completed'
      });
      if (!period.repeat) {
        period.members.forEach(async (member) => {
          const memberExpense = await transactionService.findMany({
            user_id: member,
            type: 'expense',
            period_id: period.id
          });
          transactionService.create({
            type: 'income',
            amount: period.budget - (memberExpense.total_amount || 0),
            user_id: member
          });
        });
        return;
      }

      const diff = moment(period.end_date).diff(
        moment(period.start_date),
        'minute'
      );
      const newEndDate = moment(period.end_date)
        .add(diff, 'minute')
        ?.toISOString();

      const expenseTotal = await transactionService.findMany({
        type: 'expense',
        period_id: period.id
      });

      await periodService.create({
        members: period?.members,
        budget: period.budget - (expenseTotal?.total_amount || 0),
        pig_id: period?.pig_id,
        repeat: true,
        expense: 0,
        id: undefined,
        status: 'running',
        start_date: period.end_date,
        end_date: newEndDate
      });
    },
    null,
    true
  );

  job.start();
  console.log('Running cron job for period id: ', period?.id);
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
