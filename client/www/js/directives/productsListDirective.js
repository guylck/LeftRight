app.directive("productsListDirective", ['$ionicPopup', 'PROD_UNITS',
	function ($ionicPopup, PROD_UNITS) {
		return {
			restrict: 'E',
			//require: ['^ngModel'],
			scope: {
				readOnly: '=',
				productsList: '='
			},
			templateUrl: 'html/directives/productsListDirective.html',
			controller: function ($scope, $element) {
				
				$scope.units = {
					kg : PROD_UNITS.kg,
					u : PROD_UNITS.u
				};	
				
				$scope.isUChecked = false;
				$scope.isKgChecked = false;							
				
				var popupConfig = {
					template: 	'<div class="list center">' +
									'<label class="item item-input">' +
										'<input type="text" placeholder="תיאור" ng-model="currProd.description">' +
									'</label>' + 
									'<label class="item item-input">' +
										'<input type="number" placeholder="כמות" ng-model="currProd.amount">' +
									'</label>'  +
									'<label class="item item-input item-radio center">' +
										
										'<div class="row">' + 
											'<div class="col">' + 
												'<ion-radio ng-model="currProd.units" ng-value="units.kg" ng-checked="isKgChecked">ק"ג</ion-radio>' +
											'</div>' +
											'<div class="col">' +
													'<ion-radio ng-model="currProd.units" ng-value="units.u" ng-checked="isUChecked">יחידות</ion-radio>' + 
											'</div>' +
										'</div>' +
									'</label>' + 
								'</div>',
					title: 'הוסף מוצר',
					scope: $scope,
					buttons: [
						{ text: 'ביטול' },
						{
							text: '<b>הוסף</b>',
							type: 'button-positive',
							onTap: function(e) {
								if (!($scope.currProd.description && $scope.currProd.amount && $scope.currProd.units.id)) {

									//don't allow the user to close unless he enters wifi password
									e.preventDefault();
								} else {
									return $scope.currProd;
								}
							}
						}
					]
				};
				
				$scope.currProd = {
					units: $scope.units.u
				};
				
				$scope.editProduct = function (index) {
					$scope.currProd = angular.copy($scope.productsList[index]);
					
					$scope.isUChecked = ($scope.currProd.units.id==$scope.units.u.id);
					$scope.isKgChecked = ($scope.currProd.units.id==$scope.units.kg.id);					
					
					var editProductPopup = $ionicPopup.show(popupConfig);
					
					editProductPopup.then(function (editedProduct) {
						if (editedProduct) {
							$scope.productsList[index] = angular.copy(editedProduct);
							$scope.currProd = {
								units: $scope.units.u
							};
						}
					});
				};

				$scope.openAddPopup = function () {
					var addProductPopup = $ionicPopup.show(popupConfig);
					
					addProductPopup.then(function (product) {
						$scope.productsList.push(angular.copy(product));
						$scope.currProd = {
							units: $scope.units.u
						};
					});
				};
				$scope.removeProduct = function (productIndex) {
					
					// Deleting
					$scope.productsList.splice(productIndex, 1);
				};
			},
			link: function (scope, element, attrs, ngModelCtrl) {

			}
		}; 
	}
]);