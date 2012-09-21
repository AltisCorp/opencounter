class UsersController < ActiveController::Base
  respond_to :html, :json, :xml

  def create
    @user = User.find_or_initialize_by_email(params[:user][:email])
    if @user.update_attributes(params[:user])
      session[:user_id] = @user.id
      @user.businesses << Business.create()
    end
    respond_with @user
  end
end
