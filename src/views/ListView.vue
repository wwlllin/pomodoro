<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">事項</h1>
      </v-col>
      <v-col cols="12">
        <v-text-field
          variant="solo-filled"
          label="新增事項"
          v-model="newItem"
          :rules="[rules.required, rules.length]"
          append-icon="mdi-plus"
          ref="newItemInput"
          @click:append="onInputSubmit"
          @keydown.enter="onInputSubmit"
        ></v-text-field>
        <!-- ((
                variant="solo-filled" -> 用 variant 參數指定不同型態的東西，可參考 vuetify 文件
                v-model="newItem" -> 有輸入欄位需綁定 v-model
                vuetify 的 v-text-field 有內建驗證功能，但驗證的 function 要自己寫。
                方法1:自己寫每個規則的驗證 function / 方法2:引用外部套件作表單欄位的驗證
                :rules="[]" -> 驗證是綁定 rules 參數，陣列內放每個驗證規則
                append-icon="mdi-plus" -> 在輸入欄位後新增一個 icon
                ref="newItemInput" -> 呼叫元件中的 function
                @keydown.enter="onInputSubmit" -> 在 vuetify form 元件 v-form 中，當按送出表單時會自動呼叫驗證，去驗證表個欄位是否ok。但 keydown 無此功能，故須自行呼叫元件內的 function 去作驗證，即驗證是被動的，驗證沒過卻可以按 enter 新增，故要enter 時手動叫欄位去驗證，即自己新增東西要自己手動驗證。若不想每次新增都要自行驗證，可用 v-for 包起來，如 form @submit.prevent
        )) -->
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="item.id">
              <td>
                <span v-show="!item.edit">{{ item.name }}</span>
                <v-text-field
                v-show="item.edit"
                v-model="item.model"
                :rules="[rules.required, rules.length]"
                ref="editItemInput"
                @keydown.enter="onEditInputSubmit(item.id, i)"
                autofocus
                ></v-text-field>
              </td>
              <td>
                <template v-if="!item.edit">
                  <!--
                    <v-btn icon="mdi-pencil" variant="text" color="green" @click="item.edit = true"></v-btn>
                  -->
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    color="green"
                    @click="editItem(item.id)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="red"
                    @click="delItem(item.id)"
                  ></v-btn>
                </template>
                <template v-else>
                  <v-btn
                    icon="mdi-check"
                    variant="text"
                    color="green"
                    @click="onEditInputSubmit(item.id, i)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-undo"
                    variant="text"
                    color="red"
                    @click="cancelEditItem(item.id)"
                  ></v-btn>
                </template>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="2">沒有事項</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">已完成事項</h1>
      </v-col>
      <v-col col="12">
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in finishedItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="red"
                  @click="delFinishedItem(item.id)"
                ></v-btn>
              </td>
            </tr>
            <tr v-if="finishedItems.length === 0">
              <td colspan="2">沒有已完成事項</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useListStore } from '@/store/list'
import { storeToRefs } from 'pinia'

const list = useListStore()
const { items, finishedItems } = storeToRefs(list)
const { addItem, editItem, delItem, cancelEditItem, confirmEditItem, delFinishedItem } = list
// (( function 固定不變 無須用 storeToRefs 做響應式綁定 直接解構即可))

const newItem = ref('')
const newItemInput = ref(null)
// ((若在 setup 內元件要給 ref 的話，要取一個同名的 ref))
const editItemInput = ref([])

const onInputSubmit = async () => {
  const validate = await newItemInput.value.validate()
  console.log(validate)
  if (validate.length > 0) return
  addItem(newItem.value)
  newItemInput.value.reset()
}

const onEditInputSubmit = async (id, i) => {
  const validate = await editItemInput.value[i].validate()
  if (validate.length > 0) return
  confirmEditItem(id)
}

// (( {} 內放的是 function function固定不會變 不需要動態監聽，所以不需要 ref 或 reactive))
const rules = {
  required: (value) => {
    return Boolean(value) || '欄位必填'
  },
  length: (value) => {
    return value.length >= 3 || '必須三個字以上'
  }
}

// (( 1.vuetify 文章寫法是簡寫 ))
// required: value => !!value || 'asdasd'

// (( 2.原寫法 ))
// required: (value) => {
//  return !!value || 'asdasd'
// }

// (( 3.另一種寫法 ))
// required: (value) => {
//  return Boolean(value) || '欄位必填'
// }

// (( 只要驗證 function return true 表成功，return false 或文字 會判斷失敗 文字會被當成錯誤訊息))
// (( value 是欄位 v-model 的值(使用者輸入的值) 、 || return 第一個是 true 的東西))
// (( !!value : 若 value 是'123' = string(資料型態是文字) -> !'123' = false(+!變成布林值＆正反相反) -> !!'123' = true(+!相反再+!轉正) => !!value return 出去))
// (( !!value : 若 value 是'' = string(資料型態是文字) -> !'123' = true(+!變成布林值＆正反相反) -> !!'123' = false(+!相反再+!相反回原樣) => 'asdasd' return 出去 成錯誤訊息))
// (( Boolean(value) : 把輸入的值交給 Boolean 去判斷， true 就 true ， false 就 false))

</script>
