angular.module('demo')
    .directive('timepicker', function () {
        return {
            restrict: 'EA', //restricts usage of directive
            templateUrl: 'timepicker.html',
            scope: true,
            require: 'ngModel',

            //link binds data to the templateUrl
            link: function (scope, elm, atrib, ngModel) {
                scope.viewTime = moment();
                scope.isMinuteMode = false;

                var selectedTime = null;

                var startOfSelectedTime = moment.isMoment(selectedTime) ? selectedTime.clone().startOf('hour') : null;

                //generates hour objects to be used as timeUnits in timepicker.html
                function generateHours() {
                    scope.timeUnits = [];
                    var startTime = moment().startOf('day');
                    var endTime = moment().endOf('day');

                    var time = startTime.clone()
                    while (time < endTime) {
                        scope.timeUnits.push({
                            label: time.format('HH'),
                            time: time.valueOf(),

                        });

                        time.add(1, 'hour');
                    }

                }

                //generates minute objects to be used as timeUnits in timepicker.html
                function generateMinutes() {
                    scope.timeUnits = [];
                    var startMin = moment().startOf('hour');
                    var endMin = moment().endOf('hour');
                    var min = startMin.clone();
                    while (min < endMin) {
                        scope.timeUnits.push({
                            label: min.format(':mm'),
                            time: min.valueOf(),

                        });

                        min.add(5, 'minutes');
                    }
                }

                //sets viewTime in scope to new time value
                ngModel.$formatters.push(function (value) {
                    if (value) {
                        selectedTime = moment(value);
                        scope.viewTime = selectedTime.clone();
                    }
                    else {
                        selectedTime = null;
                    }

                });

                //generates initial model data
                ngModel.$render = generateHours;

                //button click action
                scope.setSelectedTime = function (time) {
                    temp = moment(time);
                    selectedTime = selectedTime ? moment(selectedTime) : moment();
                    if (scope.isMinuteMode) {
                        //Only changes minutes if in minute mode
                        selectedTime.minute(temp.minute());
                    }
                    else {
                        selectedTime.hour(temp.hour());
                        //Sets minute mode after setting hours
                        scope.isMinuteMode = true;

                    }

                    scope.viewTime = selectedTime.clone();

                    //hardcoded to generateMinutes after first click
                    generateMinutes();

                    ngModel.$setViewValue(selectedTime);


                };
            }
        };

    });
