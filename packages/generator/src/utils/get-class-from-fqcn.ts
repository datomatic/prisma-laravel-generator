const getClassFromFQCN = (fqcn: string) => {
  const asMatch = /\s+as\s+/gi.exec(fqcn);
  if (asMatch) {
    return fqcn.slice(asMatch.index + 4).trim();
  }

  if (fqcn.includes('\\')) {
    return fqcn.slice(fqcn.lastIndexOf('\\') + 1);
  }
  return fqcn;
};

export default getClassFromFQCN;
