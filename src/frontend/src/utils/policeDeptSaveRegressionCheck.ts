/**
 * Development-only regression check for police department save operations.
 * Warns if a successfully saved department doesn't appear in the refreshed list.
 */

import type { PoliceDepartment } from '../backend';

export function checkPoliceDeptSaveRegression(
  savedDept: PoliceDepartment,
  currentList: PoliceDepartment[]
): void {
  // Only run in development
  if (!import.meta.env.DEV) return;

  const savedId = savedDept.id.toString();
  const foundInList = currentList.some(dept => dept.id.toString() === savedId);

  if (!foundInList) {
    console.warn(
      '⚠️ REGRESSION: Saved police department not found in refreshed list',
      {
        savedId,
        savedName: savedDept.name,
        currentListLength: currentList.length,
        currentListIds: currentList.map(d => d.id.toString()),
      }
    );
  }
}
