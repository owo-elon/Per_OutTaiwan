import {
  createApp,
  defineComponent,
  onBeforeUnmount,
  ref
} from 'vue';
import { useDialogFocus } from '../../composables/useDialogFocus';
import { useTakelistPage } from '../../composables/useTakelistPage';
import { useWeather } from '../../composables/useWeather';
import { LayoutComponent } from '../../layout/layout';
import type { TravelGender } from '../../types/takelist';
import '../../css/_global/index.css';
import '../../css/_global/layout.css';
import '../../css/takelist/takelist.css';

const TakelistApp = defineComponent({
  name: 'TakelistApp',
  components: {
    LayoutComponent
  },
  setup() {
    const packing = useTakelistPage();
    const weather = useWeather();
    const isAddOpen = ref(false);
    const isResetOpen = ref(false);
    const addDialogRef = ref<HTMLElement | null>(null);
    const resetDialogRef = ref<HTMLElement | null>(null);
    const newItemName = ref('');
    const newItemCategory = ref(packing.TAKELIST_MUST_CATEGORY);
    const feedbackMessage = ref('');
    let feedbackTimer: number | null = null;

    const showFeedback = (message: string) => {
      feedbackMessage.value = message;
      if (feedbackTimer !== null) {
        clearTimeout(feedbackTimer);
      }
      feedbackTimer = window.setTimeout(() => {
        feedbackMessage.value = '';
        feedbackTimer = null;
      }, 2200);
    };

    const startPacking = async (gender: Exclude<TravelGender, ''>) => {
      packing.startPacking(gender);
      await weather.loadWeather();
    };

    const openAddDialog = () => {
      newItemName.value = '';
      newItemCategory.value = packing.selectedCategory.value === packing.TAKELIST_ALL_CATEGORY
        ? packing.TAKELIST_MUST_CATEGORY
        : packing.selectedCategory.value;
      isAddOpen.value = true;
    };

    const closeAddDialog = () => {
      isAddOpen.value = false;
    };

    const submitCustomItem = () => {
      if (!packing.addCustomItem(newItemName.value, newItemCategory.value)) {
        showFeedback('請輸入要新增的物品');
        return;
      }

      closeAddDialog();
      showFeedback('已加入自訂物品');
    };

    const closeResetDialog = () => {
      isResetOpen.value = false;
    };

    const confirmReset = () => {
      packing.resetProgress();
      closeResetDialog();
      showFeedback('已清除目前的勾選進度');
    };

    const deleteItem = (item: Parameters<typeof packing.deleteItem>[0]) => {
      packing.deleteItem(item);
      showFeedback(item.isCustom ? '已移除自訂物品' : '已隱藏預設物品');
    };

    useDialogFocus(isAddOpen, addDialogRef, closeAddDialog);
    useDialogFocus(isResetOpen, resetDialogRef, closeResetDialog);

    onBeforeUnmount(() => {
      if (feedbackTimer !== null) {
        clearTimeout(feedbackTimer);
      }
    });

    return {
      ...packing,
      ...weather,
      isAddOpen,
      isResetOpen,
      addDialogRef,
      resetDialogRef,
      newItemName,
      newItemCategory,
      feedbackMessage,
      startPacking,
      openAddDialog,
      closeAddDialog,
      submitCustomItem,
      closeResetDialog,
      confirmReset,
      deleteItem
    };
  },
  template: `
    <LayoutComponent
      announcement-scope="country"
      :country-code="selectedCountry"
    >
      <section class="takelist-page">
        <div v-if="isLoading" class="state-panel" role="status">
          <span class="loading-ring" aria-hidden="true"></span>
          正在同步裝備資料…
        </div>
        <div v-else-if="errorMessage" class="state-panel state-panel--error" role="alert">
          {{ errorMessage }}
        </div>

        <div v-else-if="!hasStarted" class="packing-onboarding">
          <div class="packing-onboarding__copy">
            <p class="eyebrow">PACKING PROTOCOL / STEP 01</p>
            <h1>建立你的出發清單</h1>
            <p>先選擇目的地與旅客類型，系統會保留既有清單規則並載入專屬項目。</p>
          </div>

          <div class="onboarding-panel">
            <fieldset>
              <legend>目的地</legend>
              <div class="country-grid">
                <button
                  v-for="[code, country] in countries"
                  :key="code"
                  type="button"
                  :disabled="!country.implemented"
                  :class="{ 'is-active': selectedCountry === code }"
                  :aria-pressed="selectedCountry === code"
                  @click="selectCountry(code)"
                >
                  <span aria-hidden="true">{{ country.flag }}</span>
                  <strong>{{ country.name }}</strong>
                  <small>{{ country.implemented ? 'READY' : 'PLANNED' }}</small>
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>旅客類型</legend>
              <div class="gender-actions">
                <button type="button" @click="startPacking('male')">
                  <span aria-hidden="true">♂</span>
                  男性清單
                </button>
                <button type="button" @click="startPacking('female')">
                  <span aria-hidden="true">♀</span>
                  女性清單
                </button>
              </div>
            </fieldset>
          </div>
        </div>

        <template v-else>
          <header class="packing-header">
            <div>
              <button class="text-button" type="button" @click="leavePackingList">← 重新選擇</button>
              <p class="eyebrow">PACKING PROTOCOL / ACTIVE</p>
              <h1>{{ selectedCountryInfo?.flag }} {{ selectedCountryInfo?.name }}出發清單</h1>
            </div>
            <div class="packing-header__actions">
              <button
                class="secondary-button"
                type="button"
                :aria-pressed="deleteMode"
                @click="deleteMode = !deleteMode"
              >
                {{ deleteMode ? '完成整理' : '整理項目' }}
              </button>
              <button class="secondary-button" type="button" @click="isResetOpen = true">
                清除勾選
              </button>
              <button class="primary-button" type="button" @click="openAddDialog()">
                ＋ 新增物品
              </button>
            </div>
          </header>

          <div class="packing-dashboard">
            <section class="progress-panel" aria-labelledby="packing-progress-title">
              <div class="progress-panel__readout">
                <div>
                  <p id="packing-progress-title">MISSION PROGRESS</p>
                  <strong>{{ checkedCount }} / {{ totalCount }}</strong>
                </div>
                <span>{{ progressPercentage }}%</span>
              </div>
              <div
                class="progress-track"
                role="progressbar"
                aria-label="行李打包進度"
                :aria-valuenow="progressPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <i :style="{ width: progressPercentage + '%' }"></i>
              </div>
              <p v-if="isComplete" class="completion-signal" role="status">
                ✓ 所有裝備已確認，可以出發。
              </p>
            </section>

            <section class="weather-panel" aria-labelledby="weather-title">
              <div>
                <p id="weather-title">LIVE WEATHER</p>
                <select
                  v-model="selectedCity"
                  aria-label="選擇天氣城市"
                  @change="loadWeather"
                >
                  <option v-for="city in weatherCities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <strong v-if="weather">{{ Math.round(weather.temperature) }}°C</strong>
              <span v-else-if="isLoadingWeather">同步中…</span>
              <span v-else>{{ weatherError || '尚無資料' }}</span>
              <small v-if="weather">風速 {{ weather.windspeed }} km/h</small>
            </section>
          </div>

          <div class="packing-controls">
            <label class="search-control">
              <span aria-hidden="true">⌕</span>
              <span class="sr-only">搜尋物品</span>
              <input v-model="searchQuery" type="search" placeholder="搜尋裝備…" />
              <button
                v-if="searchQuery"
                type="button"
                aria-label="清除搜尋"
                @click="searchQuery = ''"
              >×</button>
            </label>

            <div class="category-tabs" role="group" aria-label="清單分類">
              <button
                v-for="category in availableCategories"
                :key="category.name"
                type="button"
                :aria-pressed="selectedCategory === category.name"
                :class="{ 'is-active': selectedCategory === category.name }"
                @click="selectCategory(category.name)"
              >
                <span aria-hidden="true">{{ category.icon }}</span>
                {{ category.name === TAKELIST_ALL_CATEGORY ? '全部' : category.name }}
              </button>
            </div>
          </div>

          <div class="packing-list" :class="{ 'is-delete-mode': deleteMode }">
            <section
              v-for="category in visibleCategories"
              :key="category.name"
              class="packing-category"
            >
              <button
                v-if="category.name === TAKELIST_MUST_CATEGORY"
                class="category-heading category-heading--button"
                type="button"
                :aria-expanded="mustExpanded || Boolean(searchQuery)"
                @click="mustExpanded = !mustExpanded"
              >
                <span><i>{{ category.icon }}</i>{{ category.name }}</span>
                <b>{{ category.items.length }}</b>
                <em aria-hidden="true">{{ mustExpanded || searchQuery ? '−' : '+' }}</em>
              </button>
              <div v-else class="category-heading">
                <span><i>{{ category.icon }}</i>{{ category.name }}</span>
                <b>{{ category.items.length }}</b>
              </div>

              <Transition name="category-reveal">
                <div
                  v-if="category.name !== TAKELIST_MUST_CATEGORY || mustExpanded || searchQuery"
                  class="packing-items"
                >
                  <div
                    v-for="item in category.items"
                    :key="item.id"
                    class="packing-item"
                    :class="{ 'is-checked': item.checked }"
                  >
                    <button
                      class="packing-item__toggle"
                      type="button"
                      :aria-pressed="item.checked"
                      @click="toggleItem(item)"
                    >
                      <span class="packing-checkbox" aria-hidden="true">
                        {{ item.checked ? '✓' : '' }}
                      </span>
                      <span>{{ item.name }}</span>
                      <small v-if="item.isCustom">CUSTOM</small>
                    </button>
                    <button
                      v-if="deleteMode"
                      class="packing-item__delete"
                      type="button"
                      :aria-label="'移除 ' + item.name"
                      @click="deleteItem(item)"
                    >×</button>
                  </div>
                </div>
              </Transition>
            </section>

            <div v-if="hasNoResults" class="empty-state" role="status">
              <span aria-hidden="true">⌕</span>
              <strong>找不到符合的裝備</strong>
              <p>試著清除搜尋或切換分類。</p>
            </div>
          </div>
        </template>

        <Transition name="toast">
          <div v-if="feedbackMessage" class="app-toast" role="status">
            {{ feedbackMessage }}
          </div>
        </Transition>

        <Transition name="dialog">
          <div v-if="isAddOpen" class="dialog-backdrop" @click.self="closeAddDialog">
            <section
              ref="addDialogRef"
              class="app-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-item-title"
              tabindex="-1"
              @keydown.esc.prevent="closeAddDialog"
            >
              <button class="dialog-close" type="button" aria-label="關閉" @click="closeAddDialog">×</button>
              <p class="eyebrow">NEW EQUIPMENT</p>
              <h2 id="add-item-title">新增自訂物品</h2>
              <form @submit.prevent="submitCustomItem">
                <label>
                  物品名稱
                  <input v-model="newItemName" type="text" maxlength="60" placeholder="例如：備用眼鏡" />
                </label>
                <label>
                  所屬分類
                  <select v-model="newItemCategory">
                    <option
                      v-for="category in availableCategories.filter(item => item.name !== TAKELIST_ALL_CATEGORY)"
                      :key="category.name"
                      :value="category.name"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </label>
                <div class="dialog-actions">
                  <button class="secondary-button" type="button" @click="closeAddDialog">取消</button>
                  <button class="primary-button" type="submit">加入清單</button>
                </div>
              </form>
            </section>
          </div>
        </Transition>

        <Transition name="dialog">
          <div v-if="isResetOpen" class="dialog-backdrop" @click.self="closeResetDialog">
            <section
              ref="resetDialogRef"
              class="app-dialog app-dialog--compact"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-title"
              tabindex="-1"
              @keydown.esc.prevent="closeResetDialog"
            >
              <p class="eyebrow">RESET PROGRESS</p>
              <h2 id="reset-title">清除目前勾選進度？</h2>
              <p>自訂物品與已隱藏項目不會被還原或刪除。</p>
              <div class="dialog-actions">
                <button class="secondary-button" type="button" @click="closeResetDialog">取消</button>
                <button class="danger-button" type="button" @click="confirmReset">清除勾選</button>
              </div>
            </section>
          </div>
        </Transition>
      </section>
    </LayoutComponent>
  `
});

createApp(TakelistApp).mount('#app');
