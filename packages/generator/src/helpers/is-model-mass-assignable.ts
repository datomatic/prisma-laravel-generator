import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isModelMassAssignable = (model: DMMF.Model) =>
  findOnDocumentation('mass-assignable', model.documentation);

export default isModelMassAssignable;
