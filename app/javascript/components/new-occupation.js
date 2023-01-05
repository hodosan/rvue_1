import * as Vue from "vue"
import {getCsrfToken} from "./getCsrfToken"
import {Occupation}    from "./occupation"
import {SelectTime}    from "./select-time"

const NewOccupation = {
  components: {
    'occupation': Occupation,
    'selectTime': SelectTime,
  },
  props: ['tday', 'mns', 'mnlist', 'current'],
  template: `
    <div class="mb-5">日付 {{tday}}</div>
    <div v-show="showAllFlag">
      <div v-for="room of rooms">
        <label for="room.id">{{room.name}}：</label>
        <input type="radio" id="room.id" v-model="selected" v-on:change="onchange" v-bind:value="room.id" /><br />
        <div class="mt-2 flex">
          <template v-for="(mn, i) of mns">
            <span v-if="reserved(room.id, i) === 2" 
                    :name="mn" 
                    class="border-none py-3 flex-1 bg-green-600"></span>
            <span v-else-if="reserved(room.id, i) === 1" 
                    :value="oid" 
                    :name="mn"
                    @click.self="deleteOwn($event)" 
                    class="cursor-pointer border-none py-3 flex-1 bg-red-200"></span>
            <span v-else 
                    :name="mn" 
                    class="border-none py-3 flex-1 bg-green-200"></span>
          </template>
        </div> 
        <div class="mb-2 flex">
          <template v-for="(mn, i) of mns">
            <span   :name="mn" 
                    class="border-l py-1 flex-1 text-gray-400 text-xs">
                    {{mn.slice(3,5) === '00' ? mn.slice(0, 2) : '' }}</span>
          </template>
        </div> 
      </div>
    </div>
    <div v-show="!showAllFlag">
      <selectTime v-if="selectFlag"></selectTime>
      <occupation v-if="occupation.frmFlag"></occupation>
    </div>
  `,
  data(){
    return {
      //possibleRange:        {}, mn.slice(0, 2)
      rooms:                [],
      selected:             0,
      selectFlag:           false,
      showAllFlag:          true,
      selectedRoom: {
              rid:          0,
              name:         '',
              number:       0,
              profile:      '',
      },
      reservedOccupations:  [],
      reservedList:         {},
      oid:                  0,
      occupation: {
            room_id:        '',
            user_id:        '',
            day:            '',
            time_s:         '',
            time_e:         '',
            reservation:    false,
            confirmed:      false,
            frmFlag:        false,
      }
    }
  },
  provide() {
    return {
      selectedRoom:   this.selectedRoom,
      occupation:     this.occupation,
      onFormSubmited: this.onFormSubmited,
      getOccupations: this.getOccupations,
      mnlist:         this.mnlist,
      mns:            this.mns,
      tday:           this.tday,
      selected:       Vue.computed(() => this.selected),
      reserved:       this.reserved,
      getResevedList: this.getResevedList,
      reservedList:   Vue.computed(() => this.reservedList),
   }
  },
  created: function(){
    this.getRooms();
    this.getOccupations();
    console.log("created 発火");
  },
  //mounted: function(){
    //this.getOccupations();
    //console.log("mounted 発火");
  //},
  methods: {
    getRooms() {
      fetch('/rooms.json')
        .then(response => response.json())
        .then(data => {
          this.rooms = data;
          //console.log(data);
        })
    },
    getOccupations() {
      fetch(`/occupations/of_tday.json?day=${this.tday}`)
        .then(response => response.json())
        .then(data => {
          this.reservedOccupations = data.of_tday;
          console.log(`getOccupations発火 reservedOccupations.length= ${this.reservedOccupations.length}`);
        });
    },
    onchange() {
      //console.log(`${this.selected}`);
      const result = this.rooms.find(({id}) => id === this.selected);
      //console.log(result.name);
      this.selectedRoom.rid     = result.id;
      this.selectedRoom.name    = result.name;
      this.selectedRoom.number  = result.number;
      this.selectedRoom.profile = result.profile;
      this.showAllFlag          = false;
      this.selectFlag           = true;
    },
    getResevedList() {
      const rev = {};
      const compare = (a, b) => a - b; 
      for (const room of this.rooms) {
        //console.log(`room.id=${room.id}`);
        let ary = [];
        for (const item of this.reservedOccupations) {
          let startNo = this.mnlist[item.time_s.slice(11, 16)];
          let endNo   = this.mnlist[item.time_e.slice(11, 16)];
          if (room.id === item.room_id) {
            for (let inx = startNo; inx <= endNo; inx++) {
              ary.push(inx);
            }
          } 
        };

        rev[room.id] = ary.sort(compare);
        this.reservedList = rev;
        console.log(this.reservedList); 
      }
    },
    onFormSubmited(){
      this.getOccupations();
      this.showAllFlag = true;
      this.selected    = 0;
      this.selectFlag  = false;
    },
    reserved(room_id, i) {
      //console.log(typeof(this.current));
      let flg = 0;
      for (const item of this.reservedOccupations) {
        //console.log(typeof(item.user_id));
        let start = this.mnlist[item.time_s.slice(11, 16)];
        let end   = this.mnlist[item.time_e.slice(11, 16)];
        //console.log(`${start}, ${end}`);
        if (room_id === item.room_id) {
          if (i >= start && i <= end) {
            if (item.user_id === this.current) {
              flg = 1;
              this.oid = item.oid;
              //console.log(`item ${item.oid}  ${item.user_id} ${item.day}`)
            } else {
              flg = 2;
            }
          }
        } 
      };
      //console.log(`flg ${flg}`);
      return flg;
    },
    deleteOwn(ev) {
      //console.log(ev.target.getAttribute('value'));
      let oid = ev.target.getAttribute('value')
      console.log(oid);
      let res = window.confirm("削除してよろしいですか？");
      if (!res) {
        return
      };

      fetch(`/occupations/${oid}.json`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': getCsrfToken()
        }
      })
      .then(() => {
        this.onFormSubmited();
      })
     },
  }

};

const app = Vue.createApp({
  components: {
    'new-occupation': NewOccupation,
    'occupation':   Occupation,
    'selectTime':   SelectTime,
  },
});


app.mount('#new-occupation');



//setRoom() {
//  fetch('/rooms.json',{
//    method:  'POST',
//    headers: {
//      'Content-Type': 'application/json',
//      'X-Requested-With': 'XMLHttpRequest',
//      'X-CSRF-TOKEN': getCsrfToken()
//    },
//    body: JSON.stringify({
//      name:       this.postRoom.name,
//      number:     this.postRoom.number,
//      profile:    this.postRoom.profile
//    })
//  })
//    .then(response => response.json())
//    .then(data =>console.log(data))
//},
//updateRoom() {
//  fetch('/rooms/3.json',{
//    method:  'PUT',
//    headers: {
//      'Content-Type': 'application/json',
//      'X-Requested-With': 'XMLHttpRequest',
//      'X-CSRF-TOKEN': getCsrfToken()
//    },
//    body: JSON.stringify({
//      name:       'Vue3の部屋',
//      number:     '3',
//      profile:    'Vue3の部屋です'
//    })
//  })
//    .then(response => response.json())
//    .then(data =>console.log(data))
//},
