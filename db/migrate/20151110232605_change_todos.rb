class ChangeTodos < ActiveRecord::Migration
  def change
    add_column :todos, :topic, :string, null: false
  end
end
