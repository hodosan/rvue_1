p @mns

json.today    @tday

json.mns do
  json.array! @mns do |mn|
      json.mn           mn
  end if @mns
end

json.mnlist do
  @mns.each_with_index do |mn, inx|
    json.mn             inx
  end
end
