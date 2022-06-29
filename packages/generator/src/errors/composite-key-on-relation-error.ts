class CompositeKeyOnRelationError extends Error {
  public static MESSAGE =
    'Relations must reference to just one primary key column, since composite primary keys are not supported by Eloquent: https://laravel.com/docs/9.x/eloquent#composite-primary-keys';

  constructor(message?: string) {
    super(message ?? CompositeKeyOnRelationError.MESSAGE);
    Object.setPrototypeOf(this, CompositeKeyOnRelationError.prototype);
  }
}

export default CompositeKeyOnRelationError;
