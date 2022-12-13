class OccupationsController < ApplicationController
  before_action :set_occupation, only: %i[ show edit update destroy ]
  include OccupationsHelper

  # GET /occupations or /occupations.json
  def index
    #@occupations = Occupation.enable
    #p @occupations
    @enable_days = Calender.enable
    p @enable_days
    # calender 表示用データ作成
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
  end

  # GET /occupations/1 or /occupations/1.json
  def show
  end

  # GET /occupations/new
  def new
    @occupation = Occupation.new
  end

  # GET /occupations/1/edit
  def edit
  end

  # POST /occupations or /occupations.json
  def create
    @occupation = Occupation.new(occupation_params)

    respond_to do |format|
      if @occupation.save
        format.html { redirect_to occupation_url(@occupation), notice: "Occupation was successfully created." }
        format.json { render :show, status: :created, location: @occupation }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @occupation.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /occupations/1 or /occupations/1.json
  def update
    respond_to do |format|
      if @occupation.update(occupation_params)
        format.html { redirect_to occupation_url(@occupation), notice: "Occupation was successfully updated." }
        format.json { render :show, status: :ok, location: @occupation }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @occupation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /occupations/1 or /occupations/1.json
  def destroy
    @occupation.destroy

    respond_to do |format|
      format.html { redirect_to occupations_url, notice: "Occupation was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_occupation
      @occupation = Occupation.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def occupation_params
      params.require(:occupation).permit(:user_id, :room_id, :day, :time_s, :time_e, :reservation, :confirmed)
    end
end
