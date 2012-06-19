require 'data_mapper'
require 'csv'

DataMapper.setup(:default, ENV['DATABASE_URL'])

class Naics
  include DataMapper::Resource
  property :code, Serial
  property :description, Text
end

DataMapper.finalize

#CSV.foreach("data/naics_index.csv") do |row|
  #naics = Naics.create( :code => row[0], :description => row[1])
  #naics.save!
#end


