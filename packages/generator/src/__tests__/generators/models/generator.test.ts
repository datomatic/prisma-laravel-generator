import {getSample} from '../../__fixtures__/get-sample';
import {format} from '../../../utils/php-cs-fixer';
import generateModel from '../../../generators/models/generator';

jest.setTimeout(120_000);

test('models: generation', async () => {
  const {dmmf} = await getSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generateModel(modelInfo),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('models: generation with different prefix', async () => {
  const {dmmf} = await getSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generateModel(modelInfo, 'AnotherPrefix'),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});
