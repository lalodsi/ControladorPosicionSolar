void updateSolarTrackerTime(spa_data *spa){
  // Next data must be replace by the real time clock arduino module data
  spa->year          = 2022;
  spa->month         = 3;
  spa->day           = 13;
  spa->hour          = 13;
  spa->minute        = 00;
  spa->second        = 00;
}