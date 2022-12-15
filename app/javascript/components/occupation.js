import {getCsrfToken} from "./getCsrfToken"

export const Occupation = {
  inject: ['selectedRoom', 'occupation', 'onFormSubmited', 'getOccupations'],
  template: `
  <form class="contents" @submit="setOccupation">

    <div class="my-5">
      <label for="calender_room_id">Room</label>
      <p>{{selectedRoom.name}} {{selectedRoom.number}} {{selectedRoom.profile}} {{selectedRoom.rid}}</p>
    </div>

    <div class="my-5">
      <label for="calender_begin_time">Begin time</label>
      <input class="frm_ln" type="datetime-local" v-model="occupation.time_s" id="calender_begin_time" disabled />
    </div>

    <div class="my-5">
      <label for="calender_close_time">Close time</label>
      <input class="frm_ln" type="datetime-local" v-model="occupation.time_e" id="calender_close_time" disabled />
    </div>

    <div class="inline">
      <input  type="submit" value="登録する" class="frm_btn bg-blue-600" />
    </div>
  </form>
  `,
  methods: {
    setOccupation(e) {
      e.preventDefault();
      //console.log(this.occupation);
      //this.occupation.frmFlag = false;

      fetch('/occupations.json',{
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify({
          room_id:      this.occupation.room_id,
          user_id:      this.occupation.user_id,
          day:          this.occupation.day,
          time_s:       this.occupation.time_s,
          time_e:       this.occupation.time_e,
          reservation:  this.occupation.reservation,
          confirmed:    this.occupation.confirmed,
        })
      })
      .then(response => response.json())
      .then(data =>console.log(data))
      .then(() => {
        this.occupation.frmFlag = false;
        this.onFormSubmited();
      })
    },
    updateCalender() {
      e.preventDefault();
      this.calendar.frmFlag = false;

      fetch('/calenders/3.json',{
        method:  'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify({
          room_id:      this.occupation.room_id,
          user_id:      this.occupation.user_id,
          day:          this.occupation.day,
          time_s:       this.occupation.time_s,
          time_e:       this.occupation.time_e,
          reservation:  this.occupation.reservation,
          confirmed:    this.occupation.confirmed,
        })
      })
        .then(response => response.json())
        .then(data =>console.log(data))
    },

  }
};
