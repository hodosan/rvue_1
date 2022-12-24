class CalendersController < ApplicationController
  before_action :set_calender, only: %i[ show edit update destroy ]
  include OccupationsHelper

  # GET /calenders or /calenders.json
  def index
    @calenders = Calender.all
    #@enable_days = []
    @enable_days = Calender.enable
    @today       = Date.today
    @this_month  = @today.strftime("%m")
    month_1st    = @today.beginning_of_month
    month_last   = @today.end_of_month
    month_1st_wd = @today.beginning_of_month.wday
    cal_first    = month_1st - month_1st_wd
    cal_end      = cal_first + 6
    # 範囲オブジェクト@week作成
    @weeks = []
    6.times do |i|
      week_range = Range.new(cal_first + 7*i, cal_end + 7*i )
      @weeks << week_range
      break if week_range.include?(month_last)
    end
    # 予約可否ハッシュ作成（helper method : make_array_enable_days）使用
    @day_enable = make_array_enable_days(@today, @weeks, @enable_days)

    @begin_time   = "09:00"
    @close_time   = "17:00"
    @interval_s   = "12:00"
    @interval_e   = "13:00"
    @unit_minute  = "15"
 end

  # GET /calenders/1 or /calenders/1.json
  def show
  end

  # GET /calenders/new
  def new
    @calender = Calender.new
    @calender.day         = params[:day] 
    @calender.begin_time  = params[:day] + 'T' + params[:begin_time]
    @calender.close_time  = params[:day] + 'T' + params[:close_time]
    @calender.interval_s  = params[:day] + 'T' + params[:interval_s]
    @calender.interval_e  = params[:day] + 'T' + params[:interval_e]
    @calender.unit_minute = params[:unit_minute]
    #binding.b
  end

  # GET /calenders/1/edit
  def edit
  end
  
  # PATCH/PUT /rooms/1 or /rooms/1/select.json
  def select
    selected_room = Room.find(params[:id])
    t = Time.new
    date   = t.strftime("%Y-%m-%d")
    #tdate = t.strftime("%Y-%m-%dT%H:%M:%S")
    bTime  = date + "T09:00"
    cTime  = date + "T17:00"
    isTime = date + "T12:00"
    ieTime = date + "T13:00"
    wday   = t.wday
    @state_data = [selected_room, date, bTime, cTime, isTime, ieTime, wday]
    return @state_data
  end

  # POST /calenders or /calenders.json
  def create
    #p calender_params
    #binding.b
    @calender = Calender.new(calender_params)

    respond_to do |format|
      if @calender.save
        #format.html { redirect_to calender_url(@calender), notice: "Calender was successfully created." }
        format.html { redirect_to calenders_url, notice: "Calender was successfully created." }
        format.json { render :show, status: :created, location: @calender }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @calender.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /calenders/1 or /calenders/1.json
  def update
    respond_to do |format|
      if @calender.update(calender_params)
        format.html { redirect_to calender_url(@calender), notice: "Calender was successfully updated." }
        format.json { render :show, status: :ok, location: @calender }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @calender.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /calenders/1 or /calenders/1.json
  def destroy
    @calender.destroy

    respond_to do |format|
      format.html { redirect_to calenders_url, notice: "Calender was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_calender
      @calender = Calender.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def calender_params
      params.require(:calender).permit(:day, :begin_time, :close_time, :interval_s, :interval_e, :unit_minute, :no_use)
    end
end
