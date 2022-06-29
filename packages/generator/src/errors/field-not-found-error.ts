class FieldNotFoundError extends Error {
  public static MESSAGE = 'Unable to find the field in the schema.';

  constructor(message?: string) {
    super(message ?? FieldNotFoundError.MESSAGE);
    Object.setPrototypeOf(this, FieldNotFoundError.prototype);
  }
}

export default FieldNotFoundError;
