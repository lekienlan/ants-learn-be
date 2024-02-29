import type { periods } from '@prisma/client';
import { CronJob } from 'cron';
import { transactionService } from 'modules/transaction';
import moment from 'moment';
import prisma from 'prisma';

import { periodService } from '.';

const scheduledJobs: Record<string, CronJob> = {};

const runPeriodJob = async (period: periods) => {
  periodService.update(period.id, {
    status: 'inactive'
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
  const newEndDate = moment(period.end_date).add(diff, 'minute')?.toISOString();

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
    status: 'active',
    start_date: period.end_date,
    end_date: newEndDate
  });
};

const scheduleTaskForPeriod = (period: periods) => {
  // Convert period.end_date to a cron pattern
  // Example: Assuming you want to run the job every day at the time specified by end_date
  const endDate = new Date(period.end_date);
  const currentDate = new Date();

  console.log(endDate <= currentDate, endDate, currentDate);

  // Check if the end date has already passed
  if (endDate <= currentDate) {
    // Run the job immediately
    console.log('Running overdue cron job for period id: ', period?.id);
    runPeriodJob(period);
    return;
  }

  const cronPattern = `${endDate.getMinutes()} ${endDate.getHours()} * * *`;
  const job = new CronJob(
    cronPattern,
    async () => {
      runPeriodJob(period);
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
    where: { status: { in: ['active'] } }
  }); // Fetch all periods from the database
  periods?.forEach(scheduleTaskForPeriod);
};

export { restartPeriodScheduledTasks, scheduleTaskForPeriod };
