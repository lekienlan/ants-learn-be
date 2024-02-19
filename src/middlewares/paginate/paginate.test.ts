import type { transaction_type_enum } from '@prisma/client';
import prismaMock from 'test/prismaMock';

import paginate, { paginateFilter, paginateFilterSql } from './paginate';

describe('paginateFilter', () => {
  it('should format filter with array', () => {
    const filter = {
      name: ['John', 'Doe'],
      age: ['25', '30']
    };

    const formattedFilter = paginateFilter(filter);

    expect(formattedFilter).toEqual({
      name: { gte: 'John', lte: 'Doe' },
      age: { gte: 25, lte: 30 }
    });
  });
  it('should format filter with empty array', () => {
    const filter = {
      name: ['', ''],
      age: ['', '']
    };

    const formattedFilter = paginateFilter(filter);

    expect(formattedFilter).toEqual({});
  });

  it('should format filter with comma', () => {
    const filter = {
      name: 'Lan,Phuong'
    };

    const formattedFilter = paginateFilter(filter);

    expect(formattedFilter).toEqual({ name: { in: ['Lan', 'Phuong'] } });
  });

  it('should format filter with date range', () => {
    const filter = {
      dateRange: ['2023-01-01', '2023-01-31']
    };

    const formattedFilter = paginateFilter(filter);

    expect(formattedFilter).toEqual({
      dateRange: {
        gte: new Date('2023-01-01'),
        lte: new Date('2023-01-31')
      }
    });
  });

  it('should format filter one-item array value', () => {
    const filter = {
      name: ['John'],
      age: ['25']
    };

    const formattedFilter = paginateFilter(filter);

    expect(formattedFilter).toEqual({
      name: { gte: 'John' },
      age: { gte: 25 }
    });
  });

  it('should format filter single value', () => {
    const filter = {
      name: 'John',
      age: '25'
    };

    const formattedFilter = paginateFilter(filter);

    expect(formattedFilter).toEqual({
      name: { in: ['John'] },
      age: { in: ['25'] }
    });
  });

  it('should handle empty filter', () => {
    const filter = {};

    const formattedFilter = paginateFilter(filter);

    expect(formattedFilter).toEqual({});
  });
});

describe('paginate', () => {
  const fakeTransaction = {
    id: '653559bad21c4b196cf3a4c6',
    amount: -10000,
    currency: null,
    date: new Date('2023-10-21T00:00:00.000Z'),
    note: 'ăn cơm',
    period_id: '6533f8fcf69468807254b754',
    type: 'expense' as transaction_type_enum,
    user_id: '651e94ef813f47c9080f71b7',
    category_id: '65256e69c8511c542ee97fa5',
    updated_at: new Date('2023-10-21T00:00:00.000Z'),
    created_at: new Date('2023-10-21T00:00:00.000Z')
  };

  beforeEach(() => {
    prismaMock.transactions.count.mockResolvedValue(2);
    prismaMock.transactions.findMany.mockResolvedValue([
      fakeTransaction,
      fakeTransaction
    ]);
  });

  it('should paginate with filters', async () => {
    // Define paginate options
    const params = {
      limit: '10',
      sort_by: '-name',
      page: '1',
      date: ['2023-10-21T00:00:00.000Z', '2023-10-22T00:00:00.000Z']
    };

    const include = { user: true };

    // Call paginate function
    const result = await paginate(prismaMock.transactions, params, include);

    expect(prismaMock.transactions.findMany).toHaveBeenCalledWith({
      where: {
        date: {
          gte: new Date('2023-10-21T00:00:00.000Z'),
          lte: new Date('2023-10-22T00:00:00.000Z')
        }
      },
      skip: 0,
      take: 10,
      orderBy: { name: 'desc' },
      include: { user: true }
    });

    // Assert the result
    expect(result).toEqual({
      results: [fakeTransaction, fakeTransaction],
      page: 1,
      limit: 10,
      total_pages: 1,
      total_results: 2
    });
  });

  it('should paginate with correct page', async () => {
    const params = {
      limit: '10',
      page: '2',
      name: 'User'
    };

    // Call paginate function
    const result = await paginate(prismaMock.transactions, params);

    expect(prismaMock.transactions.findMany).toHaveBeenCalledWith({
      where: paginateFilter(params),
      skip: 10,
      take: 10,
      orderBy: { updated_at: 'desc' },
      include: undefined
    });

    // Assert the result
    expect(result).toEqual({
      results: [fakeTransaction, fakeTransaction],
      page: 2,
      limit: 10,
      total_pages: 1,
      total_results: 2
    });
  });
});

describe('paginateFilterSql', () => {
  it('should format filter with array', () => {
    const filter = {
      name: 'John,Doe',
      age: [25, 30]
    };

    const formattedFilter = paginateFilterSql(filter);

    expect(formattedFilter).toBe(
      "name IN ('John','Doe') AND age BETWEEN 25 AND 30"
    );
  });

  it('should format filter with empty array', () => {
    const filter = {
      name: '',
      age: ''
    };

    const formattedFilter = paginateFilterSql(filter);

    expect(formattedFilter).toBe('');
  });

  it('should format filter with comma', () => {
    const filter = {
      name: 'Lan,Phuong'
    };

    const formattedFilter = paginateFilterSql(filter);

    expect(formattedFilter).toBe("name IN ('Lan','Phuong')");
  });

  // Add more test cases as needed
});
