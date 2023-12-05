export function enumToArray(enumType: any) {
  return Object.entries(enumType)
    .filter(entry => !isNaN(entry[0] as any))
    .map(entry => ({ name: entry[1] as string, id: +entry[0] }));
}
