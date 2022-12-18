class Calender < ApplicationRecord

  scope :enable, ->{ where("day >= ?", Date.today) }

  validates :day,
  	presence: true,
  	uniqueness: true
  
  validate :time_valid?,              if: :time_changed?

  def time_changed?
    self.begin_time_changed? || self.close_time_changed?
  end

  def time_valid?
    # close_time のチェック
    if self.close_time < self.begin_time
      errors.add(:close_time, "の時刻は、#{self.begin_time.strftime('%H:%M')}より前の時刻にして下さい。")
      return
    end
  end

end
