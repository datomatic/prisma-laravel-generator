class TooManyPathsError extends Error {
  public static MESSAGE = 'Multiple output path for a model or an enum found';

  constructor(message?: string) {
    super(message ?? TooManyPathsError.MESSAGE);
    Object.setPrototypeOf(this, TooManyPathsError.prototype);
  }
}

export default TooManyPathsError;
