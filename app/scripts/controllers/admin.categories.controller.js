/*globals prompt */
'use strict';

(function() {

    angular
        .module('simpleArmoryApp')
        .controller('AdminCategories', AdminCategories);

    function AdminCategories($scope, AdminService) {

        AdminService.getMountData().then(function(data){

            // Generic interface to allow different types of column objects
            $scope.col1items = data;
            $scope.col1child = 'subcats';
            $scope.col1Factory = function(newCol1) {
                return { name: newCol1, subcats: [], id: createSimpleGuid().toString() };
            }
            $scope.col2Factory = function(newCol2) {
                return { name: newCol2, items: [], id: createSimpleGuid().toString() };
            }
            $scope.col3child = 'items';

            // TODO: need add/delete as well
            // TODO: rename addCategory/removeCategory
            // TODO: fix move pointers to use something defined in scope here
            // TODO: rename buttons
            // TODO: either switch out here, or move out one layer and do this in admin controller
            // TODO: test save still works
            // TODO: use scope var for 'Category' and fix call to add in html

            $scope.selectionChanged(true);
        });

        $scope.selectionChanged = function(indexChanged) {

            if ($scope.col1selected === undefined) {
                $scope.col1selected = $scope.col1items[0];
            }

            $scope.col2items = $scope.col1selected[$scope.col1child];
            if ($scope.col2selected === undefined || 
                $scope.col2items.indexOf($scope.col2selected) === -1) {
                $scope.col2selected = $scope.col2items[0];
            }

            $scope.col3items = $scope.col2selected[$scope.col3child];
            if ($scope.col3selected === undefined || 
                $scope.col3items.indexOf($scope.col3selected) === -1) {
                $scope.col3selected = $scope.col3items[0];
            }

            // enable and disable up/down arrows if we're at the boundaries
            $scope.catUpDisabled = $scope.col1items.indexOf($scope.col1selected) === 0;
            $scope.catDownDisabled = $scope.col1items.indexOf($scope.col1selected) === $scope.col1items.length - 1;

            $scope.subCatUpDisabled = $scope.col2items.indexOf($scope.col2selected) === 0;
            $scope.subCatDownDisabled =  $scope.col2items.indexOf($scope.col2selected) === $scope.col2items.length - 1;

            $scope.itemUpDisabled = $scope.col3items.indexOf($scope.col3selected) === 0;
            $scope.itemDownDisabled = $scope.col3items.indexOf($scope.col2selected) === $scope.col3items.length - 1;

            // if called from an index change, then don't mark it dirty
            if (!indexChanged) {
                $scope.$parent.canSave('mounts.json', $scope.col1items);
            }
        };

        $scope.col3Label = function(col3item) {
            return col3item.icon;
        }

        $scope.move = function(up, item, parent) {
            var array = parent[$scope.col1child] ? parent[$scope.col1child] : parent[$scope.col3child];

            var src = array.indexOf(item);
            var dest = up ? src - 1 : src + 1;

            array[src] = array[dest];
            array[dest] = item;

            $scope.selectionChanged();
        };

        $scope.add = function(colArray, label, factory) {
            var newItem = prompt(label + ' to add:');
            if (newItem !== null && newItem !== '') {
                var newObj = factory(newItem);
                colArray.push(newObj);

                $scope.selectionChanged();
            }
        }

        $scope.removeCol1 = function() {
            $scope.col1items = $scope.col1items.filter(function(item){
                return item !== $scope.col1selected;
            });
            $scope.col1selected = $scope.col1items[0];
            
            $scope.selectionChanged();
        };

        $scope.removeCol2 = function() {
            $scope.col1selected[$scope.col1child] = $scope.col1selected[$scope.col1child].filter(function(item){
                return item !== $scope.col2selected;
            });

            $scope.selectionChanged();
        };

        function createSimpleGuid() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1) + (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
        }
    }

})();