class UsersController < ApplicationController
  respond_to :html, :json, :xml

  def create
    @user = User.find_or_create_by_email(params[:user][:email])
    if @user.update_attributes(params[:user])
      cookies.permanent[:token] = @user.token
      current_user = @user
    end
    session[:user_id] = @user.id
    respond_with @user
  end
  
  def update
    @user = current_user
    if @user.update_attributes(params[:user])
      cookies.permanent[:token] = @user.token
      session[:user_id] = @user.id
      current_user = @user
    end
    respond_with @user
  end
  
  def summary_email
    Rails.logger.debug "Updating planning: Current user: #{current_user}"
    if current_user
      PlanningMailer.submission_email(current_user).deliver
      render :json => { :status => "sent" }
    else
      render :json => { :status => "error" }
    end
  end
  
  def help_email
    PlanningMailer.help_email(params, current_user).deliver
    render :json => { :status => "sent" }    
  end
end
