class MultipleDataSourcesError extends Error {
  public static MESSAGE =
    'Multiple data sources are not supported: https://www.prisma.io/docs/concepts/components/prisma-schema/data-sources';

  constructor(message?: string) {
    super(message ?? MultipleDataSourcesError.MESSAGE);
    Object.setPrototypeOf(this, MultipleDataSourcesError.prototype);
  }
}

export default MultipleDataSourcesError;
