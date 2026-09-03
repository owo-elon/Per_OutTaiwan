import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  TAKELIST_ALL_CATEGORY,
  TAKELIST_MUST_CATEGORY
} from '../constants/takelist';
import { fetchJson } from '../services/json.service';
import type {
  DisplayPackingCategory,
  PackingCategoryDefinition,
  PackingItemDefinition,
  PackingListEntry,
  TakelistData,
  TravelGender
} from '../types/takelist';
import {
  loadPackingState,
  saveCheckedItems,
  saveCustomItems,
  saveDeletedItems
} from './useTakelistStorage';

function isPackingItem(value: PackingItemDefinition | PackingCategoryDefinition) {
  return 'id' in value;
}

export function useTakelistPage() {
  const data = ref<TakelistData | null>(null);
  const selectedCountry = ref('');
  const selectedGender = ref<TravelGender>('');
  const selectedCategory = ref(TAKELIST_ALL_CATEGORY);
  const searchQuery = ref('');
  const mustExpanded = ref(false);
  const deleteMode = ref(false);
  const items = ref<PackingListEntry[]>([]);
  const deletedIds = ref(new Set<string>());
  const isLoading = ref(true);
  const errorMessage = ref('');
  let controller: AbortController | null = null;

  const countries = computed(() => Object.entries(data.value?.countries ?? {}));
  const selectedCountryInfo = computed(() => (
    selectedCountry.value ? data.value?.countries[selectedCountry.value] : null
  ));
  const hasStarted = computed(() => Boolean(selectedCountry.value && selectedGender.value));

  const availableCategories = computed(() => {
    const names = new Set(items.value.map((item) => item.category));
    const categories = [{ name: TAKELIST_ALL_CATEGORY, icon: '◉' }];

    if (names.has(TAKELIST_MUST_CATEGORY)) {
      categories.push({ name: TAKELIST_MUST_CATEGORY, icon: '⚠' });
    }

    for (const category of data.value?.defaultItems.categories ?? []) {
      if (names.has(category.name)) {
        categories.push({ name: category.name, icon: category.icon });
      }
    }

    for (const name of names) {
      if (!categories.some((category) => category.name === name)) {
        categories.push({ name, icon: '✦' });
      }
    }

    return categories;
  });

  const visibleCategories = computed<DisplayPackingCategory[]>(() => {
    const query = searchQuery.value.trim().toLocaleLowerCase('zh-TW');
    const groups = new Map<string, PackingListEntry[]>();

    for (const item of items.value) {
      if (selectedCategory.value !== TAKELIST_ALL_CATEGORY
        && item.category !== selectedCategory.value) {
        continue;
      }

      if (query && !item.name.toLocaleLowerCase('zh-TW').includes(query)) {
        continue;
      }

      const group = groups.get(item.category) ?? [];
      group.push(item);
      groups.set(item.category, group);
    }

    return availableCategories.value
      .filter((category) => category.name !== TAKELIST_ALL_CATEGORY)
      .map((category) => ({
        name: category.name,
        icon: category.icon,
        items: groups.get(category.name) ?? []
      }))
      .filter((category) => category.items.length > 0);
  });

  const totalCount = computed(() => items.value.length);
  const checkedCount = computed(() => items.value.filter((item) => item.checked).length);
  const progressPercentage = computed(() => (
    totalCount.value ? Math.round((checkedCount.value / totalCount.value) * 100) : 0
  ));
  const isComplete = computed(() => totalCount.value > 0 && checkedCount.value === totalCount.value);
  const hasNoResults = computed(() => !isLoading.value && visibleCategories.value.length === 0);

  const matchesAudience = (item: PackingItemDefinition) => (
    (!item.gender || item.gender === selectedGender.value)
    && (
      !item.country
      || item.country.toLocaleLowerCase('en-US')
        === selectedCountry.value.toLocaleLowerCase('en-US')
    )
  );

  const rebuildItems = () => {
    if (!data.value || !selectedCountry.value || !selectedGender.value) {
      items.value = [];
      return;
    }

    const stored = loadPackingState(selectedCountry.value, selectedGender.value);
    deletedIds.value = stored.deletedIds;
    const nextItems: PackingListEntry[] = [];

    const addItem = (
      item: PackingItemDefinition,
      category: string,
      isMust = false
    ) => {
      if (!matchesAudience(item) || stored.deletedIds.has(item.id)) {
        return;
      }

      nextItems.push({
        ...item,
        category,
        isMust,
        checked: stored.checkedIds.has(item.id)
      });
    };

    data.value.defaultItems.must.forEach((item) => addItem(item, TAKELIST_MUST_CATEGORY, true));
    data.value.defaultItems.categories.forEach((category) => {
      category.items.forEach((item) => addItem(item, category.name));
    });

    const countrySpecific = data.value.defaultItems[selectedCountry.value] ?? [];
    countrySpecific
      .filter(isPackingItem)
      .forEach((item) => addItem(item, item.category || '其他'));

    for (const storedItem of stored.customItems) {
      nextItems.push({
        ...storedItem,
        checked: stored.checkedIds.has(storedItem.id),
        category: storedItem.category || '其他',
        isMust: storedItem.category === TAKELIST_MUST_CATEGORY,
        isCustom: true
      });
    }

    items.value = nextItems;
    if (!availableCategories.value.some((category) => category.name === selectedCategory.value)) {
      selectedCategory.value = TAKELIST_ALL_CATEGORY;
    }
  };

  const startPacking = (gender: Exclude<TravelGender, ''>) => {
    if (!selectedCountry.value) {
      return;
    }

    selectedGender.value = gender;
    selectedCategory.value = TAKELIST_ALL_CATEGORY;
    searchQuery.value = '';
    mustExpanded.value = false;
    deleteMode.value = false;
    rebuildItems();
  };

  const leavePackingList = () => {
    selectedGender.value = '';
    searchQuery.value = '';
    deleteMode.value = false;
    items.value = [];
  };

  const selectCountry = (country: string) => {
    selectedCountry.value = country;
    selectedGender.value = '';
    items.value = [];
  };

  const selectCategory = (category: string) => {
    selectedCategory.value = category;
    if (category === TAKELIST_MUST_CATEGORY) {
      mustExpanded.value = true;
    }
  };

  const toggleItem = (item: PackingListEntry) => {
    item.checked = !item.checked;
    saveCheckedItems(selectedCountry.value, selectedGender.value, items.value);
  };

  const addCustomItem = (name: string, category: string) => {
    const trimmedName = name.trim();
    if (!trimmedName || !selectedCountry.value || !selectedGender.value) {
      return false;
    }

    const item: PackingListEntry = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: trimmedName,
      checked: false,
      category,
      isMust: category === TAKELIST_MUST_CATEGORY,
      isCustom: true
    };

    items.value.push(item);
    saveCustomItems(selectedCountry.value, selectedGender.value, items.value);
    return true;
  };

  const deleteItem = (item: PackingListEntry) => {
    items.value = items.value.filter((candidate) => candidate.id !== item.id);

    if (item.isCustom) {
      saveCustomItems(selectedCountry.value, selectedGender.value, items.value);
    } else {
      deletedIds.value.add(item.id);
      saveDeletedItems(selectedCountry.value, selectedGender.value, deletedIds.value);
    }

    saveCheckedItems(selectedCountry.value, selectedGender.value, items.value);
  };

  const resetProgress = () => {
    items.value.forEach((item) => {
      item.checked = false;
    });
    saveCheckedItems(selectedCountry.value, selectedGender.value, items.value);
  };

  onMounted(async () => {
    controller = new AbortController();
    try {
      data.value = await fetchJson<TakelistData>('takelist/takelist.json', controller.signal);
      const firstImplemented = Object.entries(data.value.countries)
        .find(([, country]) => country.implemented)?.[0];
      selectedCountry.value = firstImplemented ?? '';
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        errorMessage.value = '行李清單載入失敗，請稍後再試。';
        console.error(error);
      }
    } finally {
      isLoading.value = false;
    }
  });

  onBeforeUnmount(() => controller?.abort());

  return {
    TAKELIST_ALL_CATEGORY,
    TAKELIST_MUST_CATEGORY,
    countries,
    selectedCountry,
    selectedCountryInfo,
    selectedGender,
    selectedCategory,
    searchQuery,
    mustExpanded,
    deleteMode,
    items,
    availableCategories,
    visibleCategories,
    totalCount,
    checkedCount,
    progressPercentage,
    isComplete,
    hasNoResults,
    hasStarted,
    isLoading,
    errorMessage,
    selectCountry,
    startPacking,
    leavePackingList,
    selectCategory,
    toggleItem,
    addCustomItem,
    deleteItem,
    resetProgress
  };
}
