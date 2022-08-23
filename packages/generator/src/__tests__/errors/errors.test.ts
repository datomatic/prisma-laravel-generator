import CompositeKeyError from '../../errors/composite-key-error';
import CompositeKeyOnRelationError from '../../errors/composite-key-on-relation-error';
import CuidNotSupportedError from '../../errors/cuid-not-supported-error';
import FieldNotFoundError from '../../errors/field-not-found-error';
import FillableGuardedConflictError from '../../errors/fillable-guarded-conflict-error';
import HiddenVisibleConflictError from '../../errors/hidden-visible-conflict-error';
import InvalidLaravelTimestampsError from '../../errors/invalid-laravel-timestamps-error';
import MappedFieldError from '../../errors/mapped-field-error';
import MassAssignableConflictError from '../../errors/mass-assignable-conflict-error';
import ModelNotFoundError from '../../errors/model-not-found-error';
import MultipleDataSourcesError from '../../errors/multiple-data-sources-error';
import MultipleInheritanceError from '../../errors/multiple-inheritance-error';

const errors = [
  CompositeKeyError,
  CompositeKeyOnRelationError,
  CuidNotSupportedError,
  FieldNotFoundError,
  FillableGuardedConflictError,
  HiddenVisibleConflictError,
  InvalidLaravelTimestampsError,
  MappedFieldError,
  MassAssignableConflictError,
  ModelNotFoundError,
  MultipleDataSourcesError,
  MultipleInheritanceError,
];

test.each(errors)('Error: %s', ErrorClass => {
  expect(ErrorClass.MESSAGE).toBeDefined();

  const error = new ErrorClass();
  expect(error.message).toBe(ErrorClass.MESSAGE);

  const customMessage = 'Message!';
  const errorWithMessage = new ErrorClass(customMessage);
  expect(errorWithMessage.message).toBe(customMessage);
});
