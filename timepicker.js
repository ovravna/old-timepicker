angular.module('demo')
    .directive('timepicker', function () {
        return {
            restrict: 'EA',
            templateUrl: 'timepicker.html',
            scope: true,
            require: 'ngModel',


            link: function (scope, elm, atrib, ngModel) {
                scope.viewTime = moment();
                scope.isMinuteMode = false;

                var selectedTime = null;

                var startOfSelectedTime = moment.isMoment(selectedTime) ? selectedTime.clone().startOf('hour') : null;

                function generateHours() {
                    scope.timeUnits = [];
                    var startTime = moment().startOf('day');
                    var endTime = moment().endOf('day');

                    var time = startTime.clone()
                    while (time < endTime) {
                        scope.timeUnits.push({
                            label: time.format('HH'),
                            time: time.valueOf(),
                            selected: time.isSame(startOfSelectedTime)

                        });

                        time.add(1, 'hour');
                    }

                }

                function generateMinutes() {
                    scope.timeUnits = [];
                    var startMin = moment().startOf('hour');
                    var endMin = moment().endOf('hour');
                    var min = startMin.clone();
                    while (min < endMin) {
                        scope.timeUnits.push({
                            label: min.format(':mm'),
                            time: min.valueOf(),
                            selected: min.isSame(startOfSelectedTime)

                        });

                        min.add(5, 'minutes');
                    }
                }


                ngModel.$formatters.push(function (value) {
                    if (value) {
                        selectedTime = moment(value);
                        scope.viewTime = selectedTime.clone();
                    }
                    else {
                        selectedTime = null;
                    }

                });

                ngModel.$render = generateHours;

                scope.setSelectedTime = function (time) {
                    temp = moment(time);
                    selectedTime = selectedTime ? moment(selectedTime) : moment();
                    if (scope.isMinuteMode) {
                        selectedTime.minute(temp.minute());
                    }
                    else {
                        selectedTime.hour(temp.hour());
                        scope.isMinuteMode = true;

                    }

                    scope.viewTime = selectedTime.clone();
                    generateMinutes();

                    ngModel.$setViewValue(selectedTime);


                };
            }
        };

    });
