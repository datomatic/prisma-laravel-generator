class MappedFieldError extends Error {
  public static MESSAGE =
    'Laravel does not provide a way to map attributes to columns with different names. Please, remove all your @map attributes on your fields.';

  constructor(message?: string) {
    super(message ?? MappedFieldError.MESSAGE);
    Object.setPrototypeOf(this, MappedFieldError.prototype);
  }
}

export default MappedFieldError;
