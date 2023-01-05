export const SelectTime = {
  inject: [
    'mnlist', 
    'mns', 
    'tday',
    'selectedRoom',
    'selected', 
    'onFormSubmited', 
    'getOccupations',
    'reserved',
    'getResevedList',
    'reservedList',
    'occupation',
  ],
  template: `
    <div>選択したRoom : {{selectedRoom.name}} </div>
    <div class="my-2 flex">
      <template v-for="(mn, i) of mns">
        <span v-if="reserved(injectSelected, i)" :id="mn" :value="mn" 
                              class="border-none py-3 flex-1 bg-green-600"></span>
        <span v-else :id="mn" :value="mn" :ref="mn" 
            @mouseenter.self="menter($event)" @mouseleave.self="mleave($event)"
            @click.self="click(injectSelected, mn, $event)"
            class="border-none py-3 flex-1 bg-green-200" ></span>
      </template>
    </div>
    <div class="mb-2 flex">
    <template v-for="(mn, i) of mns">
      <span   :name="mn" 
              class="border-l py-1 flex-1 text-gray-400 text-xs">
              {{mn.slice(3,5) === '00' ? mn.slice(0, 2) : '' }}</span>
    </template>
  </div> 
  <div v-if="buttonFlg">
    <button @click="selectAgain" class="frm_btn bg-red-300 mt-10">時刻選択やり直し</button>
  </div>
  `,
  data(){
    return {
      buttonFlg:          false,
      start:              -1,
      start_mn:           '',
      end:                -1,
      end_mn:             '',
      injectSelected:     this.selected,
      injectReservedList: this.reservedList
    }
  },
  created: function(){
    this.getOccupations();
    //console.log(this.mnlist);
    this.getResevedList();
    console.log("created 発火 on select-time");
  },
methods: {
    menter(ev) {
      //console.log(ev);
      if (ev.target.classList.contains('bg-green-200')){
        ev.target.classList.remove('bg-green-200');
        ev.target.classList.add('bg-green-400');
      }
    },
    mleave(ev) {
      if (ev.target.classList.contains('bg-green-400')){
        ev.target.classList.remove('bg-green-400');
        ev.target.classList.add('bg-green-200');
      }
    },
    availableMnlist(selRoom, point) {
      //console.log(`point ${point} selRoom ${selRoom}`);
      //console.log(this.injectReservedList); 
      const notAvailable = this.injectReservedList[selRoom]; 
      //console.log(`notAvailable ${notAvailable}`); 
      const arylist   = Object.values(this.mnlist);
      const available = arylist.filter(i => notAvailable.indexOf(i) == -1)
      //console.log(`available ${available}`); 

      let startInx = -1;
      if (available.includes(point)) {
        startInx = available.indexOf(point);
      } else {
        return;
      }
      //let startInx = available.indexOf(point) !== -1;
      let endInx   = startInx;
      let startValue = point;
      let endValue   = point;

      let incremented = point;
      while (available.includes(incremented)) {
        endInx = available.indexOf(incremented);
        endValue = incremented;
        incremented = incremented + 1;
      }
      const res = {
        startInx,  
        startValue, 
        endInx, 
        endValue};

      return res;
    },
    click(selRoom, mn, ev) {
      //console.log(`selRoom ${selRoom} mn ${mn}`); 
      let point = this.mnlist[mn];
      //console.log(`point ${point} `);
      if (this.start >= 0 && this.end > this.start) {
        return;
      }
      if (this.start === -1) {
        const range = this.availableMnlist(selRoom, point);
        this.possibleRange = range;
        this.start = this.possibleRange.startValue;
        //console.log(range);
        console.log(`start ${range.startValue}`); 
        console.log(`maxEnd ${range.endValue}`); 
        ev.target.classList.add('bg-blue-400');
        ev.target.classList.remove('bg-green-400');
        this.occupation.room_id = this.injectSelected;
        this.occupation.day     = this.tday;
        this.start_mn = mn;
        this.occupation.time_s  = this.tday + 'T' + this.start_mn;
        return;
      } else {
        if (point < this.possibleRange.startValue || point > this.possibleRange.endValue) {
          return
        } else {
          this.end = point;
          this.end_mn = mn;
          this.occupation.time_e  = this.tday + 'T' + this.end_mn;
          this.occupation.frmFlag = true;
          //console.log(this.$refs[mn][0].classList);
          this.buttonFlg = true;
          this.checkBetweenMn(this.start, this.end, this.buttonFlg);
        }
      }
    },
    checkBetweenMn(start, end, touch) {
      let paintStart = start;
      if (touch) {
        paintStart = start + 1;
      } 
      for (let inx = paintStart; inx <= end; inx++) {
        let mn = this.getKeyByValue(this.mnlist, inx);
        if (touch) {
          this.$refs[mn][0].classList.remove('bg-green-400');
          this.$refs[mn][0].classList.add('bg-blue-400');
        } else {
          this.$refs[mn][0].classList.remove('bg-blue-400');
          this.$refs[mn][0].classList.add('bg-green-200');
        } 
      }        
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    },
    selectAgain() {
      this.occupation.frmFlag = false;
      this.buttonFlg = false;
      this.checkBetweenMn(this.start, this.end, this.buttonFlg);
      this.start = -1;
      this.start_mn = '';
      this.end   = -1;
      this.end_mn = '';
    },
  }
};
