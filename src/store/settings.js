import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  // ((箭頭函式中若直接 return 可以不寫 {}，可以少一層，但這裡寫的是物件，單只有 {} 語法會解讀成 function 的 {} ，故需再用 () 包起來))
  // state: () => {
  //   return {
  //     alarms: [],        // (( 陣列 alarms: [], 存有那些鈴聲))
  //     selectedAlarm: 1,  // (( 變數 selectedAlarm 表目前選的是哪個鈴聲))
  //   }
  // }

  state: () => ({
    alarms: [
      // (( new URL('相對路徑', import.meta.url).href 為要在 js 中使用 assets 檔案的固定寫法，若要在 js 中指向 assets 中的檔案就會用到))
      // (( assets 和 public 的差別 : assets 會有序號 public 沒有，故用 assets 需用相對路徑寫法 以避免瀏覽器快取))
      {
        id: 1,
        name: '鬧鐘',
        file: new URL('@/assets/alarm.mp3', import.meta.url).href
      },
      {
        id: 2,
        name: 'Yay',
        file: new URL('@/assets/yay.mp3', import.meta.url).href
      }
    ],
    selectedAlarm: 1,
    notify: true
  }),
  getters: {
    selectedAlarmFile () {
      const i = this.alarms.findIndex(alarm => alarm.id === this.selectedAlarm)
      return this.alarms[i].file
    }
  },
  persist: {
    key: 'pomodoro-settings',
    paths: [
      'selectedAlarm', 'notify'
    ]
  }
})
