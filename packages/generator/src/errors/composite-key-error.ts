class CompositeKeyError extends Error {
  public static MESSAGE =
    'Composite primary keys are not supported by Eloquent: https://laravel.com/docs/9.x/eloquent#composite-primary-keys';

  constructor(message?: string) {
    super(message ?? CompositeKeyError.MESSAGE);
    Object.setPrototypeOf(this, CompositeKeyError.prototype);
  }
}

export default CompositeKeyError;
