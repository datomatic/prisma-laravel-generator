class InvalidLaravelTimestampsError extends Error {
  public static MESSAGE =
    'Both `created` and `updated` timestamps need to be defined: https://laravel.com/docs/9.x/eloquent#timestamps';

  constructor(message?: string) {
    super(message ?? InvalidLaravelTimestampsError.MESSAGE);
    Object.setPrototypeOf(this, InvalidLaravelTimestampsError.prototype);
  }
}

export default InvalidLaravelTimestampsError;
