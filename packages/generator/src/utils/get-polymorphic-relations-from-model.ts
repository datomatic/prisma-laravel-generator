import {DMMF} from '@prisma/generator-helper';

/* TODO:
     [ ] polymorphic one-to-one
     [ ] polymorphic one-to-meny
     [ ] polymorphic many-to-many
 */

type MorphOneRelation = {
  name: string;
  className: string;
  relationshipName: string;
  typeColumn?: string; // ignore if == <relationshipName>_type
  idColumn?: string; // ignore if == <relationshipName>_id
};

type MorphToRelation = {
  name: string;
  relationshipName?: string; // ignore if == relation name (php function name)
  typeColumn?: string; // ignore if == <Str::snake(relationshipName)>_type
  idColumn?: string; // ignore if == <Str::snake(relationshipName)>_id
};

type MorphManyRelation = {
  name: string;
  className: string;
  relationshipName: string;
  typeColumn?: string; // ignore if == <relationshipName>_type
  idColumn?: string; // ignore if == <relationshipName>_id
};

type MorphToManyRelation = {
  name: string;
  className: string;
  relationshipName: string;
  pivotTable?: string; // ignore if == <any_other_word>_<Str::plural(last-word)> using words of relationshipName
  foreignPivotKey?: string; // ignore if == <relationshipName>_id
  relatedPivotKey?: string; // ignore if == <Str::snake(related->className)>_<related->keyName>
  // TODO: Error if type is not <relationshipName>_type: https://github.com/laravel/framework/blob/9.x/src/Illuminate/Database/Eloquent/Relations/MorphToMany.php#L49
};

type MorphedByManyRelation = {
  name: string;
  className: string;
  relationshipName: string;
  pivotTable?: string; // ignore if == <any_other_word>_<Str::plural(last-word)> using words of relationshipName
  foreignPivotKey?: string; // ignore if == <Str::snake(this->className)>_<this->keyName>
  relatedPivotKey?: string; // ignore if == <relationshipName>_id
  // TODO: Error if type is not <relationshipName>_type: https://github.com/laravel/framework/blob/9.x/src/Illuminate/Database/Eloquent/Relations/MorphToMany.php#L49
};

const getPolymorphicRelationsFromModel = (
  model: DMMF.Model,
  models: DMMF.Model[],
) => {
  const imports = new Set<string>();

  const morphOne: MorphOneRelation[] = [];
  const morphTo: MorphToRelation[] = [];
  const morphMany: MorphManyRelation[] = [];
  const morphToMany: MorphToManyRelation[] = [];
  const morphedByMany: MorphedByManyRelation[] = [];

  return {
    imports,
    morphOne,
    morphTo,
    morphMany,
    morphToMany,
    morphedByMany,
  };
};

export default getPolymorphicRelationsFromModel;
