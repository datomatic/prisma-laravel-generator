class MultipleInheritanceError extends Error {
  public static MESSAGE =
    "A class, in PHP, can't inherit from more than one class. You can't have more than one extends:* annotation per model.";

  constructor(message?: string) {
    super(message ?? MultipleInheritanceError.MESSAGE);
    Object.setPrototypeOf(this, MultipleInheritanceError.prototype);
  }
}

export default MultipleInheritanceError;
