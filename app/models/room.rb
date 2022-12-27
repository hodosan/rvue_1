class Room < ApplicationRecord
  has_many :occupations, dependent: :destroy
end
