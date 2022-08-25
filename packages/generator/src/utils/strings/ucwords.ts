const ucwords = (value: string) =>
  value.replace(/(?<=\s)\S|^./gm, a => a.toUpperCase());

export default ucwords;
