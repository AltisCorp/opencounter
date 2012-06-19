require 'rubygems'
require 'sinatra'
require 'data_mapper'

require_relative 'lib/models/naics.rb'
require_relative 'lib/models/sic.rb'
DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, ENV['DATABASE_URL'])

set :root, File.dirname(__FILE__)
set :public_folder, 'public'
enable :static

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/code-search' do
  erb :codes
end

post '/code-search' do
  @naics = Naics.all(:description.like => "%#{params[:query]}%")
  @sic = Sic.all(:description.like => "%#{params[:query]}%")
  erb :codes
end

