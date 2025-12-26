<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/settings"></ion-back-button>
        </ion-buttons>
        <ion-title>服薬タスクの管理</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item v-for="task in store.tasks" :key="task.id">
          <ion-label>
            <h2>{{ task.time }} - {{ getMedicineName(task.medicineId) }}</h2>
            <p>{{ task.dosage }}</p>
          </ion-label>
          <ion-buttons slot="end">
            <ion-button @click="openModal(task)">
              <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
            </ion-button>
            <ion-button color="danger" @click="confirmDelete(task.id)">
              <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>

      <div v-if="store.tasks.length === 0" class="empty-state">
        <p>タスクが登録されていません</p>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="openModal()">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="isModalOpen" @didDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingTask ? 'タスクの編集' : 'タスクの追加' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">閉じる</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list>
            <ion-item>
              <ion-label position="stacked">薬を選択</ion-label>
              <ion-select v-model="form.medicineId" placeholder="薬を選択してください">
                <ion-select-option v-for="med in store.medicines" :key="med.id" :value="med.id">
                  {{ med.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">時間</ion-label>
              <ion-input type="time" v-model="form.time"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">容量</ion-label>
              <ion-input v-model="form.dosage" placeholder="1錠など"></ion-input>
            </ion-item>
          </ion-list>
          <ion-button expand="block" @click="save" class="ion-margin-top">保存</ion-button>
          
          <p v-if="store.medicines.length === 0" color="danger" class="error-text">
            先に薬の管理から薬を登録してください
          </p>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, 
  IonButtons, IonBackButton, IonButton, IonIcon, IonFab, IonFabButton, IonModal, IonInput,
  IonSelect, IonSelectOption, alertController
} from '@ionic/vue';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import { ref, reactive, watch } from 'vue';
import { store, Task } from '@/store/data';

const isModalOpen = ref(false);
const editingTask = ref<Task | null>(null);

const form = reactive({
  medicineId: 0 as number,
  time: '',
  dosage: ''
});

// 薬が選択されたらデフォルト容量をセット
watch(() => form.medicineId, (newId) => {
  if (!editingTask.value && newId) {
    const med = store.getMedicineById(newId);
    if (med) {
      form.dosage = med.dosage;
    }
  }
});

const setOpen = (isOpen: boolean) => {
  isModalOpen.value = isOpen;
};

const openModal = (task?: Task) => {
  if (task) {
    editingTask.value = task;
    form.medicineId = task.medicineId;
    form.time = task.time;
    form.dosage = task.dosage;
  } else {
    editingTask.value = null;
    form.medicineId = store.medicines.length > 0 ? store.medicines[0].id : 0;
    form.time = '08:00';
    form.dosage = '';
  }
  setOpen(true);
};

const save = () => {
  if (!form.medicineId || !form.time) return;

  if (editingTask.value) {
    store.updateTask({
      ...editingTask.value,
      ...form
    });
  } else {
    store.addTask({ ...form });
  }
  setOpen(false);
};

const confirmDelete = async (id: number) => {
  const alert = await alertController.create({
    header: '確認',
    message: 'このタスクを削除しますか？',
    buttons: [
      { text: 'キャンセル', role: 'cancel' },
      { text: '削除', role: 'destructive', handler: () => store.deleteTask(id) }
    ]
  });
  await alert.present();
};

const getMedicineName = (id: number) => {
  return store.getMedicineById(id)?.name || '不明な薬';
};
</script>

<style scoped>
.empty-state {
  text-align: center;
  margin-top: 50px;
  color: #8c8c8c;
}
.error-text {
  color: var(--ion-color-danger);
  text-align: center;
  margin-top: 10px;
}
</style>
