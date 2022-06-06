class FillableGuardedConflictError extends Error {
  public static MESSAGE =
    "You can't define guarded AND fillable fields in the same model, this would lead to unexpected behaviours.";

  constructor(message?: string) {
    super(message ?? FillableGuardedConflictError.MESSAGE);
    Object.setPrototypeOf(this, FillableGuardedConflictError.prototype);
  }
}

export default FillableGuardedConflictError;
