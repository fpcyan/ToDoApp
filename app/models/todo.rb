class Todo < ActiveRecord::Base
  validates :title, :body, :topic, presence: true
  validates :done, inclusion: { in: [true, false] }

  has_many :steps, inverse_of: :todo

  before_validation :default_topic_to_general

  private
    def default_topic_to_general
      (self.topic = "General") if (self.topic.nil? || self.topic.length == 0)
    end
end
