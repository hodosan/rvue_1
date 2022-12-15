module OccupationsHelper
  def make_array_enable_days(today, weeks, enable_days)
    enables = enable_days.map do |ed|
      ed.day
    end 
    #p enables
    day_enable = {}
    weeks.each do |wk|
      wk.each do |day|
        val = enables.include?(day) ? :enable : :closed
        day_enable[day] = val
      end
    end
    #p day_enable
    return day_enable
  end


  def minute_blocks(selected_day_data)
    p selected_day_data
    day         = selected_day_data.day
    begin_time  = selected_day_data.begin_time
    close_time  = selected_day_data.close_time
    interval_s  = selected_day_data.interval_s
    interval_e  = selected_day_data.interval_e
    unit_minute = selected_day_data.unit_minute

    mns = []
    tm = begin_time
    while tm < close_time
      if tm >= interval_s && tm < interval_e
        ;
      else
        mns << tm.strftime("%H:%M")
      end
      tm = tm + unit_minute*60
    end
    
    return day, mns
  end

end
