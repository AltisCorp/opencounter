require 'spec_helper'

describe UsersController do
  describe "GET #show" do
    before :each do 
      @user =  FactoryGirl.create(:user)
      get :show, id: @user, format: :json
    end

    it("assigns @user") { assigns(:user).should == @user }
  end

  describe "POST #create" do
    before :each do
      user = FactoryGirl.attributes_for(:user)
      post :create, :user => user
    end

    it("assigns @user") { assigns(:user).should == user }
    it("sets the session") { session[:user_id].should == assigns(:user).id }
    it("renders :302") { response.status.should == 302 }
  end
end
