json.occupation do
  json.oid          @occupation.id
  json.room_id      @occupation.room_id
  json.user_id      @occupation.user_id
  json.day          @occupation.day
  json.time_s       @occupation.time_s
  json.time_e       @occupation.time_e
  json.reservation  @occupation.reservation
  json.confirmed    @occupation.confirmed
end if @occupation
