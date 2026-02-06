import type { RecipeIngredient } from "@haricot/convex-client";

export interface IngredientMatchSummary {
  matchPercentage: number;
  missingIngredients: number;
}

export function calculateIngredientMatch(
  ingredients: RecipeIngredient[],
  inventoryCodes: string[] = []
): IngredientMatchSummary {
  if (ingredients.length === 0) {
    return { matchPercentage: 100, missingIngredients: 0 };
  }

  const inventorySet = new Set(inventoryCodes);
  let ownedCount = 0;

  for (const ingredient of ingredients) {
    if (inventorySet.has(ingredient.foodCode)) {
      ownedCount += 1;
      continue;
    }

    if (ingredient.varietyCode && inventorySet.has(ingredient.varietyCode)) {
      ownedCount += 1;
    }
  }

  const matchPercentage = Math.round((ownedCount / ingredients.length) * 100);
  return {
    matchPercentage,
    missingIngredients: ingredients.length - ownedCount,
  };
}
