jest.mock('nanoid', () => ({
	nanoid: jest.fn(() => 'abc123xyz'),
}));

jest.mock('dayjs', () => {
	const mockFn = () => ({
		add: (value, unit) => ({
			toDate: () => new Date(Date.now() + value * (unit === 'days' ? 86400000 : 3600000)),
		}),
	});
	return {default: mockFn};
});
