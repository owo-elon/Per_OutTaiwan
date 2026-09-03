import { readStorageJson, writeStorageJson } from '../services/storage.service';
import type { PackingListEntry, TravelGender } from '../types/takelist';

interface StoredPackingState {
  checkedIds: Set<string>;
  customItems: PackingListEntry[];
  deletedIds: Set<string>;
}

function getStorageKeys(country: string, gender: TravelGender) {
  const suffix = `${country}_${gender}`;
  return {
    checked: `travel_packing_${suffix}`,
    custom: `travel_packing_custom_${suffix}`,
    deleted: `travel_packing_deleted_${suffix}`
  };
}

export function loadPackingState(country: string, gender: TravelGender): StoredPackingState {
  const keys = getStorageKeys(country, gender);
  return {
    checkedIds: new Set(readStorageJson<string[]>(keys.checked, [])),
    customItems: readStorageJson<PackingListEntry[]>(keys.custom, []),
    deletedIds: new Set(readStorageJson<string[]>(keys.deleted, []))
  };
}

export function saveCheckedItems(
  country: string,
  gender: TravelGender,
  items: PackingListEntry[]
) {
  writeStorageJson(
    getStorageKeys(country, gender).checked,
    items.filter((item) => item.checked).map((item) => item.id)
  );
}

export function saveCustomItems(
  country: string,
  gender: TravelGender,
  items: PackingListEntry[]
) {
  writeStorageJson(
    getStorageKeys(country, gender).custom,
    items.filter((item) => item.isCustom)
  );
}

export function saveDeletedItems(
  country: string,
  gender: TravelGender,
  deletedIds: Set<string>
) {
  writeStorageJson(getStorageKeys(country, gender).deleted, [...deletedIds]);
}
