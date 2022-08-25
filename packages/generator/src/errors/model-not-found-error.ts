class ModelNotFoundError extends Error {
  public static MESSAGE = 'Unable to find the model in the schema.';

  constructor(message?: string) {
    super(message ?? ModelNotFoundError.MESSAGE);
    Object.setPrototypeOf(this, ModelNotFoundError.prototype);
  }
}

export default ModelNotFoundError;
