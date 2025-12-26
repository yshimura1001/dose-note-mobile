<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="record" href="/tabs/record">
          <ion-icon :icon="createOutline" />
          <ion-label>記録</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="view" href="/tabs/view">
          <ion-icon :icon="calendarOutline" />
          <ion-label>見る</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="kusurin" href="/tabs/kusurin">
          <ion-icon :icon="chatbubbleEllipsesOutline" />
          <ion-label>くすりんAI</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon :icon="settingsOutline" />
          <ion-label>設定</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { createOutline, calendarOutline, chatbubbleEllipsesOutline, settingsOutline } from 'ionicons/icons';
</script>
