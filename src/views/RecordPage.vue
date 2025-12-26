<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>記録</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- 未記録リスト -->
      <ion-list v-if="unrecordedMedications.length > 0">
        <ion-list-header>
          <ion-label>未記録</ion-label>
        </ion-list-header>
        <ion-item v-for="task in unrecordedMedications" :key="task.id" button :detail="false" @click="openModal(task)">
          <ion-label>
            <h2>{{ task.time }}</h2>
            <p>{{ getMedName(task.medicineId) }} <span class="med-detail">({{ getMedType(task.medicineId) }} {{ task.dosage }})</span></p>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- 記録済みリスト -->
      <ion-list v-if="recordedMedications.length > 0">
        <ion-list-header>
          <ion-label>記録済み</ion-label>
        </ion-list-header>
        <ion-item v-for="task in recordedMedications" :key="task.id" button :detail="false" @click="openModal(task)">
          <ion-label color="medium">
            <h2>{{ task.time }}</h2>
            <p>{{ getMedName(task.medicineId) }} <span class="med-detail">({{ getMedType(task.medicineId) }} {{ task.dosage }})</span></p>
          </ion-label>
          <ion-note slot="end" color="success">
            {{ task.skipped ? 'スキップ' : '服用済' }}
          </ion-note>
        </ion-item>
      </ion-list>
      
      <div class="empty-state" v-if="store.tasks.length === 0">
        <p>今日の予定はありません</p>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="addTonpuku()">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- 詳細モーダル -->
      <ion-modal :is-open="isModalOpen" @didDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar>
            <ion-title>詳細</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">閉じる</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="selectedMedication">
            <ion-list>
              <ion-item>
                <ion-label position="stacked">薬名</ion-label>
                <ion-input v-model="selectedMedication.name"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">時間</ion-label>
                <ion-input type="time" v-model="selectedMedication.time"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">種類</ion-label>
                <ion-input v-model="selectedMedication.type"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">容量</ion-label>
                <ion-input v-model="selectedMedication.dosage"></ion-input>
              </ion-item>
            </ion-list>

            <p class="status-text">状態: {{ selectedMedication.taken ? '服用済み' : (selectedMedication.skipped ? 'スキップ' : '未記録') }}</p>
            
            <div class="button-container">
              <ion-button v-if="!selectedMedication.taken" fill="outline" color="medium" @click="skipMedication(selectedMedication)">
                スキップ
              </ion-button>
              <ion-button expand="block" @click="saveMedication(selectedMedication)" class="action-button">
                {{ selectedMedication.isNew ? '追加して記録' : (selectedMedication.taken ? '未記録に戻す' : '服用を記録する') }}
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonFab, IonFabButton, IonIcon, IonNote, IonModal, IonButtons, IonButton, IonFabList, IonInput } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { ref, computed } from 'vue';
import { store, Task } from '@/store/data';

// 記録ページでのみ使用する表示用の詳細インターフェース
interface MedicationDisplay extends Task {
  name: string;
  type: string;
  isNew?: boolean;
}

// モーダル制御
const isModalOpen = ref(false);
const selectedMedication = ref<MedicationDisplay | null>(null);

const setOpen = (isOpen: boolean) => {
  isModalOpen.value = isOpen;
};

const openModal = (task: Task) => {
  const medicine = store.getMedicineById(task.medicineId);
  selectedMedication.value = { 
    ...task, 
    name: medicine?.name || '不明な薬',
    type: medicine?.type || '不明',
    isNew: false
  };
  setOpen(true);
};

const saveMedication = (displayTask: MedicationDisplay) => {
  if (displayTask.isNew) {
    // 頓服の新規追加
    const medicine = store.medicines.find(m => m.name === displayTask.name);
    let medId = medicine?.id;
    
    if (!medId) {
      // 薬が存在しない場合は暫定的に作成（本来は管理等で作成すべきだが、簡易化のため）
      const newMedId = Date.now();
      store.medicines.push({
        id: newMedId,
        name: displayTask.name,
        type: displayTask.type,
        dosage: displayTask.dosage
      });
      medId = newMedId;
    }

    store.addTask({
      medicineId: medId,
      time: displayTask.time,
      dosage: displayTask.dosage
    });
    
    // 追加したタスクを完了状態にする
    const lastTask = store.tasks[store.tasks.length - 1];
    lastTask.taken = true;

  } else {
    // 既存タスクの更新
    const task = store.tasks.find(t => t.id === displayTask.id);
    if (task) {
      task.time = displayTask.time;
      task.dosage = displayTask.dosage;
      task.taken = !task.taken;
      if (task.taken) task.skipped = false;
    }
  }
  setOpen(false);
};

const skipMedication = (displayTask: MedicationDisplay) => {
  const task = store.tasks.find(t => t.id === displayTask.id);
  if (task) {
    task.skipped = true;
    task.taken = true;
  }
  setOpen(false);
};

const addTonpuku = () => {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // 頓服用の仮オブジェクト
  const tempMed: MedicationDisplay = {
    id: 0,
    medicineId: 0,
    name: '頓服薬',
    time: timeStr,
    taken: false,
    skipped: false,
    type: '錠剤',
    dosage: '1錠'
  };
  // @ts-ignore: isNew property for UI logic
  tempMed.isNew = true;
  
  selectedMedication.value = tempMed;
  setOpen(true);
};

// ヘルパー: 薬名取得
const getMedName = (id: number) => store.getMedicineById(id)?.name || '不明';
const getMedType = (id: number) => store.getMedicineById(id)?.type || '';

const unrecordedMedications = computed(() => store.tasks.filter(t => !t.taken));
const recordedMedications = computed(() => store.tasks.filter(t => t.taken));
</script>

<style scoped>
.empty-state {
  text-align: center;
  margin-top: 50px;
  color: #8c8c8c;
}

.med-detail {
  font-size: 0.9em;
  color: #666;
}

.status-text {
  margin-top: 20px;
  font-weight: bold;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.button-container ion-button {
  flex: 1;
}

.action-button {
  margin-top: 0;
}
</style>
