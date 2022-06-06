const getClassFromFQCN = (fqcn: string) => {
  if (fqcn.includes('\\')) {
    return fqcn.slice(fqcn.lastIndexOf('\\') + 1);
  }
  return fqcn;
};

export default getClassFromFQCN;
