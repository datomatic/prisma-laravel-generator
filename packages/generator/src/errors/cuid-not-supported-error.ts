class CuidNotSupportedError extends Error {
  public static MESSAGE = 'CUID is not natively supported by Laravel';

  constructor(message?: string) {
    super(message ?? CuidNotSupportedError.MESSAGE);
    Object.setPrototypeOf(this, CuidNotSupportedError.prototype);
  }
}

export default CuidNotSupportedError;
