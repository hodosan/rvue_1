json.of_tday do
  json.array! @tday_occupations do |tocp|
      json.oid          tocp.id
      json.room_id      tocp.room_id
      json.user_id      tocp.user_id
      json.day          tocp.day
      json.time_s       tocp.time_s
      json.time_e       tocp.time_e
      json.reservation  tocp.reservation
      json.confirmed    tocp.confirmed
  end if @tday_occupations
end
