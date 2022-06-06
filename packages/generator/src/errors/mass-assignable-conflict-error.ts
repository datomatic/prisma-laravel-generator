class MassAssignableConflictError extends Error {
  public static MESSAGE =
    "You can't define guarded or fillable fields when you set the model as mass-assignable";

  constructor(message?: string) {
    super(message ?? MassAssignableConflictError.MESSAGE);
    Object.setPrototypeOf(this, MassAssignableConflictError.prototype);
  }
}

export default MassAssignableConflictError;
