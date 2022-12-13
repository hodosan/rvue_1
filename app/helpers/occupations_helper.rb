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
end
