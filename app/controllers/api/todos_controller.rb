class Api::TodosController < ApplicationController
  def create!
    Todo.create!(todo_params)
  end

  def update!
    Todo.update!(todo_params.merge(params[:id]))
  end

  def destroy!
    Todo.destroy!(todo_params.merge(params[:id]))
  end


  private

    def todo_params
      params.require(:todo).permit(:title, :body, :done)
    end
end
