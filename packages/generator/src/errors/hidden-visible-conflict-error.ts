class HiddenVisibleConflictError extends Error {
  public static MESSAGE =
    "You can't define hidden AND visible fields in the same model, this would lead to unexpected behaviours.";

  constructor(message?: string) {
    super(message ?? HiddenVisibleConflictError.MESSAGE);
    Object.setPrototypeOf(this, HiddenVisibleConflictError.prototype);
  }
}

export default HiddenVisibleConflictError;
