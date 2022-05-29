const minimizePhp = (data = '') => {
  return data.replaceAll(/\s+/g, ' ').trim();
};

export default minimizePhp;
