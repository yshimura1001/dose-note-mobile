<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>見る</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
          <ion-label>最近の履歴</ion-label>
        </ion-list-header>
        <ion-item v-for="record in history" :key="record.id">
          <ion-label>
            <h2>{{ record.date }} {{ record.time }}</h2>
            <p>{{ record.medication }}</p>
          </ion-label>
          <ion-badge :color="record.status === '服用済' ? 'success' : 'warning'" slot="end">
            {{ record.status }}
          </ion-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonListHeader, IonBadge } from '@ionic/vue';
import { ref } from 'vue';

const history = ref([
  { id: 1, date: '2025/12/20', time: '18:00', medication: 'アムロジピン', status: '服用済' },
  { id: 2, date: '2025/12/20', time: '12:00', medication: 'メトホルミン', status: '服用済' },
  { id: 3, date: '2025/12/20', time: '08:00', medication: 'アムロジピン', status: 'スキップ' },
  { id: 4, date: '2025/12/19', time: '18:00', medication: 'アムロジピン', status: '服用済' },
]);
</script>

<style scoped>
</style>
