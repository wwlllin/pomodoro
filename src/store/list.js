// ((事項的設定，分已完成、未完成。需存入 localstorage ，又 pinia 有擴充套件可以將 state 塞入 localstorage 裡，所以把資料寫在 store中))
import { defineStore } from 'pinia'

const time = parseInt(import.meta.env.VITE_TIME)
const timeBreak = parseInt(import.meta.env.VITE_TIME_BREAK)

export const useListStore = defineStore('list', {
  state: () => ({
    items: [], // ((未完成事項的陣列))
    id: 1,
    timeleft: time,
    break: false,
    finishedItems: [],
    currentItem: ''
  }),
  // (( actions 放所有要修改的 state 的 function 。 修改可用 action 改，也可以在外部改 ))
  actions: {
    addItem (name) {
      this.items.push({
        id: this.id++,
        name,
        edit: false,
        model: name
      })
    },
    findIndexById (id) {
      return this.items.findIndex((item) => item.id === id)
    },
    editItem (id) {
      const i = this.findIndexById(id)
      if (i < 0) return
      this.items[i].edit = true
    },
    delItem (id) {
      const i = this.findIndexById(id)
      if (i < 0) return
      this.items.splice(i, 1)
    },
    cancelEditItem (id) {
      const i = this.findIndexById(id)
      if (i < 0) return
      this.items[i].model = this.items[i].name
      this.items[i].edit = false
    },
    confirmEditItem (id) {
      const i = this.findIndexById(id)
      if (i < 0) return
      this.items[i].name = this.items[i].model
      this.items[i].edit = false
    },
    setCurrentItem () {
      // (( 寫法1 ))
      // this.CurrentItem = this.items[0].name
      // this.items.splice(0, 1)
      // (( 寫法2 ))
      this.currentItem = this.break ? '休息一下' : this.items.shift().name
    },
    countdown () {
      this.timeleft--
    },
    setFinishedItem () {
      if (!this.break) {
        this.finishedItems.push({
          name: this.currentItem,
          id: this.id++
        })
      }
      this.currentItem = ''
      if (this.items.length > 0) {
        this.break = !this.break
      }
      this.timeleft = this.break ? timeBreak : time
    },
    delFinishedItem (id) {
      const i = this.finishedItems.findIndex(item => item.id === id)
      if (i < 0) return
      this.finishedItems.splice(i, 1)
    }
  },
  persist: {
    key: 'pomodoro-list'
    // (( key: 'pomodoro-list' -> localstorage 保存的名稱))
  }
})
