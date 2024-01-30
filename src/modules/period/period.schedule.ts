import type { periods } from '@prisma/client';
import { CronJob } from 'cron';
import { transactionService } from 'modules/transaction';
import prisma from 'prisma';

const scheduleTaskForPeriod = (period: periods) => {
  // Convert period.endDate to a cron pattern
  // Example: Assuming you want to run the job every day at the time specified by endDate
  const date = new Date(period.endDate);
  const cronPattern = `${date.getMinutes()} ${date.getHours()} * * *`;

  const job = new CronJob(
    cronPattern,
    async () => {
      period.members.forEach(async (member) => {
        const expenseResp = await transactionService.findMany({
          userId: member,
          type: 'expense',
          periodId: period.id
        });

        await transactionService.create({
          type: 'income',
          amount: period.budget + (expenseResp.totalAmount || 0),
          userId: member
        });
      });
      // Additional task logic here
    },
    null,
    true
  );

  job.start();
};

const restartPeriodScheduledTasks = async () => {
  const periods = await prisma.periods.findMany(); // Fetch all periods from the database
  periods?.forEach(scheduleTaskForPeriod);
};

export { restartPeriodScheduledTasks, scheduleTaskForPeriod };
