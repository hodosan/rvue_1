class Occupation < ApplicationRecord
  belongs_to :user
  belongs_to :room

  scope :of_tday, ->(tday){ where("day = ?", tday) }

end
