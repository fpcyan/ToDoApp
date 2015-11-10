class Step < ActiveRecord::Base
  validates :content, :todo, presence: true
  validates :done, inclusion: { in: [false, true] }

  belongs_to :todo, inverse_of: :steps

end
