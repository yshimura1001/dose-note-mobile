<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>くすりんAI</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <strong>くすりん</strong>
        <p>こんにちは！私は服薬管理の妖精、くすりんだよ！</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
