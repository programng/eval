angular
  .module('eval.employees')
  .controller('EmployeesController', EmployeesController);

  EmployeesController.$inject = [
    '$scope',
    'EmployeesFactory',
    'AuthFactory',
    '$rootScope'
  ];

  function EmployeesController ($scope, EmployeesFactory, AuthFactory, $rootScope) {
    var sampleData = $rootScope.data;

    function sortDataByName(dataArray) {
      return dataArray.sort(compare);
    }

    function compare(a, b) {
      // console.log(a.employee_name);
      // console.log(b.employee_name);
      if (a.employee_name.toLowerCase() < b.employee_name.toLowerCase())
         return -1;
      if (a.employee_name.toLowerCase() > b.employee_name.toLowerCase())
        return 1;
      return 0;
    }

    $scope.employees = EmployeesFactory.processEmployeesData(sampleData);
    console.log('unsorted', $scope.employees);
    console.log('sorted', sortDataByName($scope.employees));

    $scope.averageSentiment = '80';
    $scope.responseCount = '140';

    $scope.sentimentChart = null;
    $scope.responsesChart = null;

    $scope.toggleDetail = function($index) {
      $scope.selectedPosition = ($scope.selectedPosition === $index) ? -1 : $index;
    }

    $scope.showCharts = function() {

        $scope.sentimentChart = c3.generate({
          bindto: '#sentiment-chart',
          data: {
            columns: [
              ['data', 90, 50, 40, -94, 30, 40, 90],
            ],
            type: 'bar'
          },
          bar: {
            width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
          },
          grid: {
            y: {
              show: true
            }
          },
          axis: {
            x: {
              type: 'category',
              categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            },
            y: {
              max: 100,
              min: -100,
              padding: {top:0, bottom:0},
              label: { // ADD
                text: 'Percent',
                position: 'outer-middle'
              },
              tick: {
                count: 5
              }
            }
          }
        });

      $scope.responsesChart = c3.generate({
        bindto: '#responses-chart',
        data: {
          columns: [
            ['data1', 30, 200, 100, 400, 150, 250, 138]
          ]
        },
        grid: {
          y: {
            show: true
          }
        },
        axis: {
          x: {
            type: 'category',
            categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          },
          y: {
            max: 500,
            min: 0,
            padding: {top:0, bottom:0},
            label: { // ADD
              text: 'Number of Responses',
              position: 'outer-middle'
            },
            tick: {
              count: 6
            }
          }
        }
      });
    }

  }