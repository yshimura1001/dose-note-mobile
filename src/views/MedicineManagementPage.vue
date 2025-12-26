<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/settings"></ion-back-button>
        </ion-buttons>
        <ion-title>薬の管理</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item v-for="medicine in store.medicines" :key="medicine.id">
          <ion-label>
            <h2>{{ medicine.name }}</h2>
            <p>{{ medicine.type }} / {{ medicine.dosage }}</p>
          </ion-label>
          <ion-buttons slot="end">
            <ion-button @click="openModal(medicine)">
              <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
            </ion-button>
            <ion-button color="danger" @click="confirmDelete(medicine.id)">
              <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>

      <div v-if="store.medicines.length === 0" class="empty-state">
        <p>薬が登録されていません</p>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="openModal()">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="isModalOpen" @didDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingMedicine ? '薬の編集' : '薬の追加' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">閉じる</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list>
            <ion-item>
              <ion-label position="stacked">名前</ion-label>
              <ion-input v-model="form.name" placeholder="薬の名前"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">種類</ion-label>
              <ion-input v-model="form.type" placeholder="錠剤、粉薬など"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">デフォルト容量</ion-label>
              <ion-input v-model="form.dosage" placeholder="1錠など"></ion-input>
            </ion-item>
          </ion-list>
          <ion-button expand="block" @click="save" class="ion-margin-top">保存</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, 
  IonButtons, IonBackButton, IonButton, IonIcon, IonFab, IonFabButton, IonModal, IonInput,
  alertController
} from '@ionic/vue';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import { ref, reactive } from 'vue';
import { store, Medicine } from '@/store/data';

const isModalOpen = ref(false);
const editingMedicine = ref<Medicine | null>(null);

const form = reactive({
  name: '',
  type: '',
  dosage: ''
});

const setOpen = (isOpen: boolean) => {
  isModalOpen.value = isOpen;
};

const openModal = (medicine?: Medicine) => {
  if (medicine) {
    editingMedicine.value = medicine;
    form.name = medicine.name;
    form.type = medicine.type;
    form.dosage = medicine.dosage;
  } else {
    editingMedicine.value = null;
    form.name = '';
    form.type = '錠剤';
    form.dosage = '1錠';
  }
  setOpen(true);
};

const save = () => {
  if (!form.name) return;

  if (editingMedicine.value) {
    store.updateMedicine({
      ...editingMedicine.value,
      ...form
    });
  } else {
    store.addMedicine({ ...form });
  }
  setOpen(false);
};

const confirmDelete = async (id: number) => {
  const alert = await alertController.create({
    header: '確認',
    message: 'この薬を削除しますか？関連するタスクも削除されます。',
    buttons: [
      { text: 'キャンセル', role: 'cancel' },
      { text: '削除', role: 'destructive', handler: () => store.deleteMedicine(id) }
    ]
  });
  await alert.present();
};
</script>

<style scoped>
.empty-state {
  text-align: center;
  margin-top: 50px;
  color: #8c8c8c;
}
</style>
