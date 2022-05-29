import minimizePhp from '../../helpers/minimize-php';

test('minimizePhp: remove spaces', () => {
  expect(
    minimizePhp(`
    <?php
    namespace App\\Enums\\Prisma;

    enum Test {
      case A = "A";
      case B = 'B';
      case C;
    }
  `),
  ).toBe(
    `<?php namespace App\\Enums\\Prisma; enum Test { case A = "A"; case B = 'B'; case C; }`,
  );
});

test('minimizePhp: already minimized', () => {
  expect(
    minimizePhp(
      `<?php namespace App\\Enums\\Prisma; enum Test { case A = "A"; case B = 'B'; case C; }`,
    ),
  ).toBe(
    `<?php namespace App\\Enums\\Prisma; enum Test { case A = "A"; case B = 'B'; case C; }`,
  );
});
