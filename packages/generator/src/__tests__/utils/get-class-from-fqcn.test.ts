import getClassFromFQCN from '../../utils/get-class-from-fqcn';

test('getClassFromFQCN: valid', () => {
  expect(getClassFromFQCN('Illuminate\\Database\\Eloquent\\Model')).toBe(
    'Model',
  );
});

test('getClassFromFQCN: valid with just one parent', () => {
  expect(getClassFromFQCN('Illuminate\\Model')).toBe('Model');
});

test('getClassFromFQCN: with no path', () => {
  expect(getClassFromFQCN('Model')).toBe('Model');
});
