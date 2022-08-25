import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isModelPivot = (model: DMMF.Model) =>
  findOnDocumentation('pivot', model.documentation);

export default isModelPivot;
