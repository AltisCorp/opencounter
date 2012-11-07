class UsersController < ApplicationController
  respond_to :html, :json, :xml

  def create
    @user = User.find_or_initialize_by_email(params[:user][:email])
    if @user.update_attributes(params[:user])
      @current_user = @user
      @user.businesses << Business.create()
    end
    session[:user_id] = @user.id
    respond_with @user
  end
  
  def update_planning
    user = current_user
    if user
      PlanningMailer.deliver_submission_email(current_user).deliver
      render :json => { :status => "sent" }
    else
      render :json => { :status => "error" }
    end
  end
end
