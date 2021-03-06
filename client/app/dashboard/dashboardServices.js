angular
  .module('eval.dashboard', [])
  .factory('DashboardSentimentFactory', DashboardSentimentFactory)
  .factory('DashboardCommentsFactory', DashboardCommentsFactory);

  DashboardSentimentFactory.$inject = [
    '$http',
    'AuthFactory',
  ];

  DashboardCommentsFactory.$inject = [
    '$http',
    'AuthFactory',
  ];

  function DashboardSentimentFactory ($http, AuthFactory) {
    var factory = {};
    factory.sortByTime = sortByTime;
    factory.changeTimeFormat = changeTimeFormat;
    factory.filterByDay = filterByDay;
    factory.filterByWeek = filterByWeek;
    factory.filterByMonth = filterByMonth;
    factory.filterByYear = filterByYear;

    function filterByDay(data) {
      // console.log('filterByWeek', data);
      var processedData = {};
      for (var i = 0; i < data.length; i ++) {
        var hour = data[i].date.getHours();
        if (isWithinPastDay(data[i].date)) {
          if (processedData[hour]) {
            processedData[hour][0] += data[i].score;
            processedData[hour][1]++;
          } else {
            processedData[hour] = [data[i].score, 1];
          }
        }
      }
      console.log('pre procsssedData', processedData);

      var summedTotals = _.reduce(processedData, function(result, value, key) {
        result[0] += value[0];
        result[1] += value[1];
        return result
      }, [0, 0])

      var averageSentiment = summedTotals[0]/summedTotals[1] * 100;
      console.log('averageSentimentDay', summedTotals, averageSentiment);

      for (var hour in processedData) {
        processedData[hour] = ((processedData[hour][0]/processedData[hour][1]) * 100);
      }
      // console.log('processedData', processedData)
      return [processedData, averageSentiment];
    }

    function filterByWeek(data) {
      // console.log('filterByWeek', data);
      var processedData = {};
      for (var i = 0; i < data.length; i ++) {
        // console.log('MEMEMMEE', data[i].date)
        var day = data[i].date.getDay();
        if (isWithinPastWeek(data[i].date)) {
          if (processedData[day]) {
            processedData[day][0] += data[i].score;
            processedData[day][1]++;
          } else {
            processedData[day] = [data[i].score, 1];
          }
        }
      }

      var summedTotals = _.reduce(processedData, function(result, value, key) {
        result[0] += value[0];
        result[1] += value[1];
        return result
      }, [0, 0])

      var averageSentiment = summedTotals[0]/summedTotals[1] * 100;
      console.log('averageSentimentWeek', summedTotals, averageSentiment);

      for (var day in processedData) {
        processedData[day] = ((processedData[day][0]/processedData[day][1]) * 100);
      }
      // console.log('processedData', processedData)
      return [processedData, averageSentiment];
    }

    function filterByMonth(data) {
      // console.log('filterByWeek', data);
      var processedData = {};
      for (var i = 0; i < data.length; i ++) {
        var month = data[i].date.getMonth();
        if (isWithinPastYear(data[i].date)) {
          if (processedData[month]) {
            processedData[month][0] += data[i].score;
            processedData[month][1]++;
          } else {
            processedData[month] = [data[i].score, 1];
          }
        }
      }

      var summedTotals = _.reduce(processedData, function(result, value, key) {
        result[0] += value[0];
        result[1] += value[1];
        return result
      }, [0, 0])

      var averageSentiment = summedTotals[0]/summedTotals[1] * 100;
      console.log('averageSentimentMonth', summedTotals, averageSentiment);

      for (var month in processedData) {
        processedData[month] = ((processedData[month][0]/processedData[month][1]) * 100);
      }
      console.log('processedData', processedData)
      return [processedData, averageSentiment];
    }

    function filterByYear(data) {
      // console.log('filterByWeek', data);
      var processedData = {};
      for (var i = 0; i < data.length; i ++) {
        var year = data[i].date.getFullYear();
        if (processedData[year]) {
          processedData[year][0] += data[i].score;
          processedData[year][1]++;
        } else {
          processedData[year] = [data[i].score, 1];
        }
      }

      var summedTotals = _.reduce(processedData, function(result, value, key) {
        result[0] += value[0];
        result[1] += value[1];
        return result
      }, [0, 0])

      var averageSentiment = summedTotals[0]/summedTotals[1] * 100;
      console.log('averageSentimentYear', summedTotals, averageSentiment);

      for (var year in processedData) {
        processedData[year] = ((processedData[year][0]/processedData[year][1]) * 100);
      }
      console.log('processedData', processedData)
      return [processedData, averageSentiment];
    }

    function sortByTime(data) {
      var sortedData = data.sort(compareByDateMilliseconds);

      function compareByDateMilliseconds(a, b) {
        return a.date - b.date;
      }

      return sortedData;
    }

    function changeTimeFormat(data) {
      return _.map(data, function(datum) {
        datum.date = new Date(datum.date);
        // console.log('changeTimeFormatFunction', datum);
        return datum;
      });
    }

    function isWithinPastDay(date) {
      var inPastDay = false;
      //get now date
      var now = new Date();
      // console.log('now', now);
      //get the month in the year
      var year = now.getFullYear();
      var month = now.getMonth();
      var date = now.getDate();
      // console.log(year, month, date);
      var nearestMidnightDateAtMidnight = new Date(year, month, date);
      // console.log('nearestMidnightDateAtMidnight', nearestMidnightDateAtMidnight);
      //compare if the value is greater than this one above
      if (date > nearestMidnightDateAtMidnight) {
        inPastDay = true;
      }
      return inPastDay;
    }

    function isWithinPastWeek(date) {
      var inPastWeek = false;
      //get now date
      var now = new Date();
      // console.log('now', now);
      //get the day of the week
      var day = now.getDay();
      //change to milliseconds
      var nowDateInMilliseconds = Date.parse(now);
      //subtract milliseconds * day
      var nearestSundayInMilliseconds = nowDateInMilliseconds - day * 86400000; //86400000 milliseconds in a day
      //subtract the right amount of time to get to a sunday
      var nearestSundayDate = new Date(nearestSundayInMilliseconds);
      // console.log('nearestSundayDate', nearestSundayDate)
      //generate new date using that info and 0,0,0
      var sundayYear = nearestSundayDate.getFullYear();
      // console.log(sundayYear);
      var sundayMonth = nearestSundayDate.getMonth();
      // console.log(sundayMonth);
      var sundayDate = nearestSundayDate.getDate();
      // console.log(sundayMonth);
      var nearestSundayDateAtMidnight = new Date(sundayYear, sundayMonth, sundayDate);
      // console.log('nearestSundayDateAtMidnight', nearestSundayDateAtMidnight);
      //compare if the value is greater than this one above
      if (date > nearestSundayDateAtMidnight) {
        inPastWeek = true;
      }
      return inPastWeek;
    }

    function isWithinPastMonth(date) {
      var inPastMonth = false;
      //get now date
      var now = new Date();
      // console.log('now', now);
      //get the month in the year
      var year = now.getFullYear();
      var month = now.getMonth();
      // console.log(year);
      var nearestFirstDayOfMonthAtMidnight = new Date(year, month, 1);
      console.log('nearestFirstDayOfMonthAtMidnight', nearestFirstDayOfMonthAtMidnight);
      //compare if the value is greater than this one above
      if (date > nearestFirstDayOfMonthAtMidnight) {
        inPastMonth = true;
      }
      return inPastMonth;
    }

    function isWithinPastYear(date) {
      var inPastYear = false;
      //get now date
      var now = new Date();
      // console.log('now', now);
      //get the month in the year
      var year = now.getFullYear();
      // console.log(year);
      var nearestJanuaryDateAtMidnight = new Date(year, 0, 1);
      // console.log('nearestJanuaryDateAtMidnight', nearestJanuaryDateAtMidnight);
      //compare if the value is greater than this one above
      if (date > nearestJanuaryDateAtMidnight) {
        inPastYear = true;
      }
      return inPastYear;
    }

    return factory;
  }

  function DashboardCommentsFactory ($http, AuthFactory) {
    var factory = {};
    factory.sortByTime = sortByTime;
    factory.changeTimeFormat = changeTimeFormat;
    factory.filterByDay = filterByDay;
    factory.filterByWeek = filterByWeek;
    factory.filterByMonth = filterByMonth;
    factory.filterByYear = filterByYear;

    function filterByDay(data) {
      // console.log('filterByWeek', data);
      var processedData = {};
      for (var i = 0; i < data.length; i ++) {
        var hour = data[i].date.getHours();
        if (isWithinPastDay(data[i].date)) {
          if (processedData[hour]) {
            processedData[hour]++;
          } else {
            processedData[hour] = 1;
          }
        }
      }
      console.log('pre procsssedData', processedData);

      return processedData;
    }

    function filterByWeek(data) {
      // console.log('filterByWeek', data);
      var processedData = {};
      for (var i = 0; i < data.length; i ++) {
        // console.log('MEMEMMEE', data[i].date)
        var day = data[i].date.getDay();
        if (isWithinPastWeek(data[i].date)) {
          if (processedData[day]) {
            processedData[day]++;
          } else {
            processedData[day] = 1;
          }
        }
      }

      // console.log('processedData', processedData)
      return processedData;
    }

    function filterByMonth(data) {
      // console.log('filterByWeek', data);
      var processedData = {};
      for (var i = 0; i < data.length; i ++) {
        var month = data[i].date.getMonth();
        // console.log(isWithinPastYear(data[i].date));
        if (isWithinPastYear(data[i].date)) {
          if (processedData[month]) {
            processedData[month]++;
          } else {
            processedData[month] = 1;
          }
        }
      }

      // console.log('processedData', processedData)
      return processedData;
    }

    function filterByYear(data) {
      // console.log('filterByWeek', data);
      var processedData = {};
      for (var i = 0; i < data.length; i ++) {
        var year = data[i].date.getFullYear();
        if (processedData[year]) {
          processedData[year]++;
        } else {
          processedData[year] = 1;
        }
      }

      // console.log('processedData', processedData)
      return processedData;
    }

    function sortByTime(data) {
      var sortedData = data.sort(compareByDateMilliseconds);

      function compareByDateMilliseconds(a, b) {
        return a.date - b.date;
      }

      return sortedData;
    }

    function changeTimeFormat(data) {
      return _.map(data, function(datum) {
        datum.date = new Date(datum.date);
        // console.log('changeTimeFormatFunction', datum);
        return datum;
      });
    }

    function isWithinPastDay(date) {
      var inPastDay = false;
      //get now date
      var now = new Date();
      // console.log('now', now);
      //get the month in the year
      var year = now.getFullYear();
      var month = now.getMonth();
      var date = now.getDate();
      // console.log(year, month, date);
      var nearestMidnightDateAtMidnight = new Date(year, month, date);
      // console.log('nearestMidnightDateAtMidnight', nearestMidnightDateAtMidnight);
      //compare if the value is greater than this one above
      if (date > nearestMidnightDateAtMidnight) {
        inPastDay = true;
      }
      return inPastDay;
    }

    function isWithinPastWeek(date) {
      var inPastWeek = false;
      //get now date
      var now = new Date();
      // console.log('now', now);
      //get the day of the week
      var day = now.getDay();
      //change to milliseconds
      var nowDateInMilliseconds = Date.parse(now);
      //subtract milliseconds * day
      var nearestSundayInMilliseconds = nowDateInMilliseconds - day * 86400000; //86400000 milliseconds in a day
      //subtract the right amount of time to get to a sunday
      var nearestSundayDate = new Date(nearestSundayInMilliseconds);
      // console.log('nearestSundayDate', nearestSundayDate)
      //generate new date using that info and 0,0,0
      var sundayYear = nearestSundayDate.getFullYear();
      // console.log(sundayYear);
      var sundayMonth = nearestSundayDate.getMonth();
      // console.log(sundayMonth);
      var sundayDate = nearestSundayDate.getDate();
      // console.log(sundayMonth);
      var nearestSundayDateAtMidnight = new Date(sundayYear, sundayMonth, sundayDate);
      // console.log('nearestSundayDateAtMidnight', nearestSundayDateAtMidnight);
      //compare if the value is greater than this one above
      if (date > nearestSundayDateAtMidnight) {
        inPastWeek = true;
      }
      return inPastWeek;
    }

    function isWithinPastMonth(date) {
      var inPastMonth = false;
      //get now date
      var now = new Date();
      // console.log('now', now);
      //get the month in the year
      var year = now.getFullYear();
      var month = now.getMonth();
      // console.log(year);
      var nearestFirstDayOfMonthAtMidnight = new Date(year, month, 1);
      console.log('nearestFirstDayOfMonthAtMidnight', nearestFirstDayOfMonthAtMidnight);
      //compare if the value is greater than this one above
      if (date > nearestFirstDayOfMonthAtMidnight) {
        inPastMonth = true;
      }
      return inPastMonth;
    }

    function isWithinPastYear(date) {
      var inPastYear = false;
      //get now date
      var now = new Date();
      // console.log('now', now);
      //get the month in the year
      var year = now.getFullYear();
      // console.log(year);
      var nearestJanuaryDateAtMidnight = new Date(year, 0, 1);
      // console.log('nearestJanuaryDateAtMidnight', nearestJanuaryDateAtMidnight);
      //compare if the value is greater than this one above
      if (date > nearestJanuaryDateAtMidnight) {
        inPastYear = true;
      }
      return inPastYear;
    }

    return factory;
  }