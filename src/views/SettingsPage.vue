<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>設定</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
          <ion-label>管理</ion-label>
        </ion-list-header>
        <ion-item button router-link="/settings/medicines" :detail="true">
          <ion-label>薬</ion-label>
        </ion-item>
        <ion-item button router-link="/settings/tasks" :detail="true">
          <ion-label>服薬タスク</ion-label>
        </ion-item>

        <ion-list-header>
          <ion-label>通知設定</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-toggle :checked="true">服薬リマインダー</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle :checked="false">飲み忘れ通知</ion-toggle>
        </ion-item>

        <ion-list-header>
          <ion-label>アカウント</ion-label>
        </ion-list-header>
        <ion-item button :detail="true">
          <ion-label>プロフィール編集</ion-label>
        </ion-item>
        <ion-item button :detail="true">
          <ion-label>データ引き継ぎ</ion-label>
        </ion-item>
        <ion-item button :detail="true" lines="none">
          <ion-label color="danger">ログアウト</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonListHeader, IonToggle } from '@ionic/vue';
</script>

<style scoped>
</style>
