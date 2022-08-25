import generateEnum from '../../../generators/enums/generator';
import {getSample} from '../../__fixtures__/get-sample';
import {format} from '../../../utils/php-cs-fixer';

jest.setTimeout(120_000);

test('enum generation', async () => {
  const {dmmf} = await getSample();

  await Promise.all(
    dmmf.datamodel.enums.map(async enumInfo => {
      expect(
        await format(
          generateEnum(enumInfo),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(enumInfo.name);
    }),
  );
});
