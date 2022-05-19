import generateEnum from '../../../generators/enums/generator';
import getSampleDmmf from '../../__fixtures__/get-sample-dmmf';
import {format} from '../../../utils/php-cs-fixer';

test('enum generation', async () => {
  const sampleDMMF = await getSampleDmmf();

  await Promise.all(
    sampleDMMF.datamodel.enums.map(async enumInfo => {
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
