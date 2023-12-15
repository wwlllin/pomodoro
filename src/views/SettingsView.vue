<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">通知設定</h1>
      </v-col>
      <v-col cols="12">
        <v-radio-group inline v-model="notify">
          <v-radio label="開啟" :value="true"></v-radio>
          <v-radio label="關閉" :value="false"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">鈴聲設定</h1>
      </v-col>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>試聽</th>
              <th>選擇</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in alarms" :key="alarm.id">
              <td>{{ alarm.name }}</td>
              <td>
                <audio :src="alarm.file" controls></audio>
                <!-- (( 加上 controls 會有瀏覽器內建的控制器 UI )) -->
              </td>
              <td>
                <v-radio-group v-model="selectedAlarm">
                  <v-radio :value="alarm.id"></v-radio>
                </v-radio-group>
                <!-- (( value 表該欄位的值， v-model 表選了什麼。 v-radio 一定要用 v-radio-group 包起來)) -->
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'
import { storeToRefs } from 'pinia'

const settings = useSettingsStore()
const { alarms, selectedAlarm } = storeToRefs(settings)
</script>

<style scoped>
:deep(.v-selection-control-group.v-selection-control-group--inline) {
  margin: auto
}
</style>
<!-- (( <style scoped> 只會影響到該元件，若要操作該元件內的元件 需 :deep() 輔助，單純 scoped 可能打不到。此為 vue 才有的css語法 一般js無 )) -->
