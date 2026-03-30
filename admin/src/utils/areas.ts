import areas from '#/assets/area/areas.json';
import cities from '#/assets/area/cities.json';
import provinces from '#/assets/area/provinces.json';

export const areaOption = provinces.map((province: any) => {
  const childrenCities = cities
    .filter((city: any) => city.provinceCode === province.code)
    .map((city: any) => {
      const childrenAreas = areas
        .filter((area: any) => area.cityCode === city.code)
        .map((area: any) => ({
          label: area.name,
          value: area.code,
          isLeaf: true,
        }));
      return {
        label: city.name,
        value: city.code,
        children: childrenAreas,
      };
    });
  return {
    label: province.name,
    value: province.code,
    children: childrenCities,
  };
});

export function showAreaText(ar: any[]) {
  if (ar.length === 0) return '';
  const result: string[] = [];
  if (ar.length >= 1) {
    const p = (provinces as any[]).find((p) => p.code === ar[0]);
    if (p) result.push(p.name);
  }
  if (ar.length >= 2) {
    const c = (cities as any[]).find((c) => c.code === ar[1]);
    if (c) result.push(c.name);
  }
  if (ar.length >= 3) {
    const a = (areas as any[]).find((a) => a.code === ar[2]);
    if (a) result.push(a.name);
  }
  return result.join('-');
}

export function showAreasText(ars: any[][]) {
  return ars.map((area) => showAreaText(area));
}

export function showAreasWithJson(json: any) {
  if (typeof json !== 'object') {
    try {
      return showAreasText(JSON.parse(json));
    } catch {
      return [];
    }
  }
  return showAreasText(json);
}
