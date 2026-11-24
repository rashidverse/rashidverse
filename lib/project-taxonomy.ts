export const MAIN_SKILL_CATEGORIES = [
  "WordPress Design & Development",
  "Video Editing & Motion Graphics",
  "Multimedia Designer",
  "WordPress Plugin Development",
] as const;

export type MainSkillCategory = (typeof MAIN_SKILL_CATEGORIES)[number];

export const DEFAULT_MAIN_SKILL_CATEGORY: MainSkillCategory =
  MAIN_SKILL_CATEGORIES[0];

export function cleanTaxonomyLabel(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function normalizeTaxonomyLabel(value: unknown) {
  return cleanTaxonomyLabel(value).toLocaleLowerCase();
}

export function isMainSkillCategory(value: unknown): value is MainSkillCategory {
  return MAIN_SKILL_CATEGORIES.includes(value as MainSkillCategory);
}
