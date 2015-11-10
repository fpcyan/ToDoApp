class CreateSteps < ActiveRecord::Migration
  def change
    create_table :steps do |t|
      t.string :content, null: false
      t.boolean :done, null: false
      t.integer :todo_id, null: false

      t.timestamps null: false
    end
    add_index :steps, :todo_id
  end
end
