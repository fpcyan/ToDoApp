# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


Todo.destroy_all

todos = []
10.times do |i|
  todos << Todo.create!(title: "#{i}th Title", body: "#{i}th Body blah blah", done: false)
end
