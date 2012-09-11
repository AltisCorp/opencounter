class PermitsController < ApplicationController

  PERMITS = CSV.read(Rails.root + 'app/assets/csv/zoning_districts_and_sic_codes.csv', :headers => true)
  PERMITS_MAP = PERMITS.map{ |row| Hash[row] }
  PERMITS_HASH = PERMITS_MAP.reduce(Hash.new(0)) do |set,item| 
    set[item.delete("zoning district")] = item
    set
  end

  def show
    sic = params["sic"]
    permit = params["zoning"]
    
    zoning_lookup = PERMITS_HASH[permit]
    result = nil

    if zoning_lookup != 0
      zoning_lookup.each do |zoning_type, sics|
        if sics.nil?
          sics = ""
        end
        sics_split = sics.split(",")
        sics_split.each do |sic_symbol|
          if sic_symbol =~ /-/
            range_start, range_end = sic_symbol.split("-")
            if (range_start.to_i..range_end.to_i).include?(sic.to_i)
              result = zoning_type
              break
            end
          else
            if sic_symbol == sic
              result = zoning_type
              break
            end
          end
        end
      end
    end
    result ||= "unknown"

    render :json => {"permit" => result }
  end
  

end
